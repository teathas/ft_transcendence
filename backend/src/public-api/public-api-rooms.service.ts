import { Injectable, NotFoundException } from '@nestjs/common';
import { rm } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ApiRoomDto } from './dto/api-room.dto';
import { ListApiRoomsDto } from './dto/list-api-rooms.dto';
import { pageArgs } from '../common/dto/page.dto';
import { Prisma } from '../generated/prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

const apiRoomSelect = {
  id: true,
  name: true,
  subject: true,
  visibility: true,
  ownerId: true,
  createdAt: true,
  lastActiveAt: true,
  _count: { select: { members: true } },
} satisfies Prisma.RoomSelect;

type ApiRoomRow = Prisma.RoomGetPayload<{ select: typeof apiRoomSelect }>;

@Injectable()
export class PublicApiRoomsService {
  constructor(private prisma: PrismaService, private notifications: NotificationsService) {}

  async list(userId: string, query: ListApiRoomsDto) {
    const search = query.search?.trim();
    const filters: Prisma.RoomWhereInput[] = [
      { members: { some: { userId } } },
    ];
    if (search) {
      filters.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { subject: { contains: search, mode: 'insensitive' } },
        ],
      });
    }
    if (query.visibility) filters.push({ visibility: query.visibility });
    if (query.ownership === 'owned') filters.push({ ownerId: userId });
    if (query.ownership === 'joined') {
      filters.push({ ownerId: { not: userId } });
    }
    const where: Prisma.RoomWhereInput = { AND: filters };
    const [items, total] = await Promise.all([
      this.prisma.room.findMany({
        where,
        select: apiRoomSelect,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        ...pageArgs({ page: query.page, pageSize: query.pageSize ?? 20 }),
      }),
      this.prisma.room.count({ where }),
    ]);
    return { items: items.map((room) => this.toView(room, userId)), total };
  }

  async get(userId: string, id: string) {
    const room = await this.prisma.room.findFirst({
      where: { id, members: { some: { userId } } },
      select: apiRoomSelect,
    });
    if (!room) throw new NotFoundException('Room not found');
    return this.toView(room, userId);
  }

  async create(ownerId: string, dto: ApiRoomDto) {
    const room = await this.prisma.room.create({
      data: {
        name: dto.name.trim(),
        subject: dto.subject.trim(),
        visibility: dto.visibility,
        inviteCode: randomBytes(4).toString('hex'),
        ownerId,
        members: { create: { userId: ownerId } },
      },
      select: apiRoomSelect,
    });
    await this.notifications.createNotification({
      recipientId: ownerId,
      actorId: ownerId,
      type: 'ROOM_CREATED',
      data: { roomId: room.id, roomName: room.name },
    });
    return this.toView(room, ownerId);
  }

  async replace(ownerId: string, id: string, dto: ApiRoomDto) {
    await this.assertOwner(ownerId, id);
    const room = await this.prisma.room.update({
      where: { id, ownerId },
      data: {
        name: dto.name.trim(),
        subject: dto.subject.trim(),
        visibility: dto.visibility,
      },
      select: apiRoomSelect,
    });
    const members = await this.prisma.roomMember.findMany({ where: { roomId: id }, select: { userId: true } });
    await Promise.all(members.map(({ userId }) => this.notifications.createNotification({
      recipientId: userId,
      actorId: ownerId,
      type: 'ROOM_UPDATED',
      data: { roomId: room.id, roomName: room.name },
    })));
    return this.toView(room, ownerId);
  }

  async remove(ownerId: string, id: string) {
    await this.assertOwner(ownerId, id);
    const room = await this.prisma.room.findUnique({
      where: { id },
      select: { name: true, members: { select: { userId: true } } },
    });
    await this.prisma.$transaction([
      this.prisma.message.deleteMany({ where: { roomId: id } }),
      this.prisma.roomMember.deleteMany({ where: { roomId: id } }),
      this.prisma.room.delete({ where: { id, ownerId } }),
    ]);

    const uploadRoot = process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads');
    await rm(join(uploadRoot, 'rooms', id), { recursive: true, force: true });
    if (room) {
      await Promise.all(room.members.map(({ userId }) => this.notifications.createNotification({
        recipientId: userId,
        actorId: ownerId,
        type: 'ROOM_DELETED',
        data: { roomId: id, roomName: room.name },
      })));
    }
  }

  private async assertOwner(ownerId: string, id: string) {
    const room = await this.prisma.room.findFirst({
      where: { id, ownerId },
      select: { id: true },
    });
    if (!room) throw new NotFoundException('Room not found');
  }

  private toView(room: ApiRoomRow, userId: string) {
    const { _count, ...fields } = room;
    return {
      ...fields,
      participantCount: _count.members,
      ownership: room.ownerId === userId ? 'owned' : 'joined',
    };
  }
}
