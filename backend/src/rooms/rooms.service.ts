import { Injectable,NotFoundException,ForbiddenException,ConflictException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto,Visibility  } from './dto/create-room.dto';
import { JoinRoomDto  } from './dto/join-room.dto';
import { randomBytes } from 'crypto';
import { FindRoomsQueryDto, RoomSort } from './dto/find-rooms-query.dto';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class RoomsService {
    constructor(
        private prisma: PrismaService,
        private realtime: RealtimeService,
    ) {}

    async touchActivity(roomId: string) {
        await this.prisma.room.update({
            where: { id: roomId },
            data: { lastActivityAt: new Date() },
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
        await this.touchActivity(roomId);
        return this.prisma.roomMember.create({
            data:{
                userId,
                roomId,
            }
        })
    }
    private getOrderBy(sort: RoomSort = RoomSort.NEWEST): Prisma.RoomOrderByWithRelationInput[] {
        switch (sort) {
            case RoomSort.MEMBERS:
            return [{ members: { _count: 'desc' } }, { createdAt: 'desc' }];
            case RoomSort.ACTIVE:
            return [{ lastActivityAt: 'desc' }, { createdAt: 'desc' }];
            case RoomSort.NEWEST:
            default:
            return [{ createdAt: 'desc' }];
        }
    }
    async findPublicRooms(query: FindRoomsQueryDto  = {}) {
        const name = query.name?.trim();
        const subject = query.subject?.trim();

        return this.prisma.room.findMany({
        where: {
            visibility: Visibility.PUBLIC,
            ...(name && { name: { contains: name, mode: 'insensitive' } }),
            ...(subject && { subject: { contains: subject, mode: 'insensitive' } }),
        },
        orderBy: this.getOrderBy(query.sort),
        select: {
            id: true, name: true, subject: true,
            visibility: true, ownerId: true, createdAt: true,
            lastActivityAt: true,_count: { select: { members: true } },
        },
        });
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
		return removed;
    }
}
