import { Injectable,NotFoundException,ForbiddenException,ConflictException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto,Visibility  } from './dto/create-room.dto';
import { JoinRoomDto  } from './dto/join-room.dto';
import { randomBytes } from 'crypto';
import { FindRoomsQueryDto, RoomSort} from './dto/find-rooms-query.dto';

@Injectable()
export class RoomsService {
    constructor(private prisma: PrismaService) {}

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
            return [{ members: { _count: 'desc' } }, { createdAt: 'desc' }, { id: 'asc' }];
            case RoomSort.ACTIVE:
            return [{ lastActivityAt: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }];
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
                lastActivityAt: true,_count: { select: { members: true } },
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
        return this.prisma.roomMember.delete({
            where: {
                userId_roomId: {
                    userId,
                    roomId,
                },
            },
        })  
    }
}
