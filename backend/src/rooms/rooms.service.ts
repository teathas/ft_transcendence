import { Injectable,NotFoundException,ForbiddenException,ConflictException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto,Visibility  } from './dto/create-room.dto';
import { JoinRoomDto  } from './dto/join-room.dto';
import { randomBytes } from 'crypto';
import { FindRoomsQueryDto, RoomSort } from './dto/find-rooms-query.dto';
import { RealtimeService } from '../realtime/realtime.service';
import { NotificationsService } from '../notifications/notifications.service';
import { assertMember } from './room-access';
import { RoomNotificationPreference } from '../generated/prisma/client';

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
            category: 'ROOM',
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
            category: 'ROOM',
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


    async getSharedRooms(friendId: string,userId :string)
    {
        const myMemberships = await this.prisma.roomMember.findMany({
            where: { userId },
            select: { roomId: true },
        });
        const myRoomIds = myMemberships.map((membership) => membership.roomId);
        const sharedMemberships = await this.prisma.roomMember.findMany({
            where: {
                userId: friendId,
                roomId: { in: myRoomIds },
            },
            select: {
                room: true,
            },
            });

        return sharedMemberships.map((membership) => membership.room);
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
            category: 'ROOM',
            data: { roomId },
            }),
        ),
        );
		return removed;
    }


    async updateNotificationPreference(roomId: string, userId: string, preference: RoomNotificationPreference)
    {
        await assertMember(this.prisma, roomId, userId);
        await this.prisma.roomMember.updateMany({
            where: {
                roomId,
                userId,
            },
            data: {
                notificationPreference: preference,
            },
        });
          return {
            roomId,
            preference,
        };

    }
}
