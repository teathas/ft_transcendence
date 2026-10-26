import { Injectable,NotFoundException,ForbiddenException,ConflictException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto,Visibility  } from './dto/create-room.dto';
import { JoinRoomDto  } from './dto/join-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { randomBytes } from 'crypto';
import { rm } from 'fs/promises';
import { join } from 'path';
import { FindRoomsQueryDto, RoomSort } from './dto/find-rooms-query.dto';
import { RealtimeService } from '../realtime/realtime.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RoomsService {
    constructor(
        private prisma: PrismaService,
        private realtime: RealtimeService,
        private notificationsService: NotificationsService
    ) {}

    async touchActivity(roomId: string) {
        await this.prisma.room.update({
            where: { id: roomId },
            data: { lastActiveAt: new Date() },
        });
    }

    //create_room
    async create(dto: CreateRoomDto, ownerId: string) {
        const inviteCode = randomBytes(4).toString('hex'); 
        const room = await this.prisma.room.create({
            data: {
                name: dto.name,
                subject: dto.subject,
                visibility: dto.visibility,
                inviteCode,
                ownerId,
            },
        });
        await this.prisma.roomMember.create({
        data:{
            userId:ownerId,
            roomId:room.id,
        }
        })
        await this.notificationsService.createNotification({
            recipientId: ownerId,
            actorId: ownerId,
            type: 'ROOM_CREATED',
            data: { roomId: room.id, roomName: room.name },
        });
        return room;
    }

    //join_room
    async join(roomId: string, userId: string,dto:JoinRoomDto) {
        const existing = await this.prisma.room.findUnique({
            where: {id : roomId},
        });
        if(!existing)
            throw new NotFoundException('Room not found');

        if(existing.visibility !== Visibility.PUBLIC) 
        {
            if(!dto.inviteCode)
                throw new ForbiddenException('Invite code is required');
            if(existing.inviteCode !== dto.inviteCode)
                throw new ForbiddenException('Invalid invite code');
        }
        const membership = await this.prisma.roomMember.findUnique({
            where: {
                userId_roomId: {
                    userId,
                    roomId,
                },
            },
        });
        if(membership)
            throw new ConflictException('User is already a member of this room');
        const existingMembers = await this.prisma.roomMember.findMany({
            where: { roomId },
            select: { userId: true },
        });
        const newMember = await this.prisma.roomMember.create({
            data:{
                userId,
                roomId,
            }
        })
        await this.touchActivity(roomId);

        await Promise.all(
        existingMembers.map((member) =>
            this.notificationsService.createNotification({
            recipientId: member.userId,
            actorId: userId,
            type: 'ROOM_MEMBER_JOINED',
            data: { roomId },
        }),
        ),
        );
        return newMember;
    }
    private getOrderBy(sort: RoomSort = RoomSort.NEWEST): Prisma.RoomOrderByWithRelationInput[] {
        switch (sort) {
            case RoomSort.MEMBERS:
            return [{ members: { _count: 'desc' } }, { createdAt: 'desc' }, { id: 'asc' }];
            case RoomSort.ACTIVE:
            return [{ lastActiveAt: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }];
            case RoomSort.NEWEST:
            default:
            return [{ createdAt: 'desc' }, { id: 'asc' }];
        }
    }
    async findPublicRooms(query: FindRoomsQueryDto  = {}) {
        const name = query.name?.trim();
        const subject = query.subject?.trim();
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where: Prisma.RoomWhereInput = {
            visibility: Visibility.PUBLIC,
            ...(name && { name: { contains: name, mode: 'insensitive' } }),
            ...(subject && { subject: { contains: subject, mode: 'insensitive' } }),
        };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.room.findMany({
            where,
            orderBy: this.getOrderBy(query.sort),
            skip,
            take: limit,
            select: {
                id: true, name: true, subject: true,
                visibility: true, ownerId: true, createdAt: true,
                lastActiveAt: true,_count: { select: { members: true } },
            },
            }),
            this.prisma.room.count({ where })
        ])
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }


    //leave_room
    async leave(roomId: string, userId: string)
    {
        const existing = await this.prisma.room.findUnique({
            where: {id : roomId},
        });
        if(!existing)
            throw new NotFoundException('Room not found');
        const membership = await this.prisma.roomMember.findUnique({
        where: {
            userId_roomId: {
                userId,
                roomId,
            },
        },
        });
        if(!membership)
            throw new NotFoundException('User is not a member of this room');
        if(userId === existing.ownerId)
        {
            const nextOwner = await this.prisma.roomMember.findFirst({
            where: {
                roomId: roomId,
                userId: {
                    not: userId,
                },
            },
            orderBy: {
                joinedAt: 'asc',
            },
            });
            if(nextOwner)
            {
                await this.prisma.room.update({
                where: {
                    id: roomId,
                },
                data: {
                    ownerId: nextOwner.userId,
                },
                });
            }
        }
        const remainingMembers = await this.prisma.roomMember.findMany({
            where: {
                roomId,
                userId: { not: userId },
            },
            select: { userId: true },
        });
        const removed = await this.prisma.roomMember.delete({
			where: {
				userId_roomId: {
					userId,
					roomId,
				},
			},
		});
		this.realtime.removeUserFromRoom(userId, roomId);
		this.realtime.emitToRoom(roomId, 'room:member-left', { roomId, userId });
        await Promise.all(
        remainingMembers.map((member) =>
            this.notificationsService.createNotification({
            recipientId: member.userId,
            actorId: userId,
            type: 'ROOM_MEMBER_LEFT',
            data: { roomId },
            }),
        ),
        );
		return removed;
    }

    /** The room, if it exists and the user owns it: what editing and deleting need. */
    private async ownedRoom(roomId: string, userId: string) {
        const room = await this.prisma.room.findUnique({ where: { id: roomId } });
        if (!room)
            throw new NotFoundException('Room not found');
        if (room.ownerId !== userId)
            throw new ForbiddenException('Only the owner can do this');
        return room;
    }

    async update(roomId: string, userId: string, dto: UpdateRoomDto) {
        await this.ownedRoom(roomId, userId);
        const room = await this.prisma.room.update({
            where: { id: roomId },
            data: {
                ...(dto.name !== undefined && { name: dto.name.trim() }),
                ...(dto.subject !== undefined && { subject: dto.subject.trim() }),
                ...(dto.visibility !== undefined && { visibility: dto.visibility }),
            },
        });
        this.realtime.emitToRoom(roomId, 'room:updated', { roomId });
        return room;
    }

    /** Removes the room with its messages, files and members, in one transaction. */
    async remove(roomId: string, userId: string) {
        await this.ownedRoom(roomId, userId);
        await this.prisma.$transaction([
            this.prisma.message.deleteMany({ where: { roomId } }),
            this.prisma.roomFile.deleteMany({ where: { roomId } }),
            this.prisma.roomMember.deleteMany({ where: { roomId } }),
            this.prisma.room.delete({ where: { id: roomId } }),
        ]);
        this.realtime.emitToRoom(roomId, 'room:deleted', { roomId });

        // Best effort: the rows are already gone, a leftover folder is harmless.
        const uploads = process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads');
        await rm(join(uploads, 'rooms', roomId), { recursive: true, force: true }).catch(() => undefined);
    }
}
