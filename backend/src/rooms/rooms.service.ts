import { Injectable,NotFoundException,ForbiddenException,ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto,Visibility  } from './dto/create-room.dto';
import { JoinRoomDto  } from './dto/join-room.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class RoomsService {
    constructor(private prisma: PrismaService) {}
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

    //join_romm
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
        return this.prisma.roomMember.create({
            data:{
                userId,
                roomId,
            }
        })
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
