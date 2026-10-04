import { Injectable,NotFoundException,ForbiddenException,ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto,Visibility  } from './dto/create-room.dto';
import { JoinRoomDto  } from './dto/join-room.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class RoomsService {
    constructor(private prisma: PrismaService) {}
    async create(dto: CreateRoomDto, ownerId: string) {
    const inviteCode = randomBytes(4).toString('hex'); 
    return this.prisma.room.create({
        data: {
            name: dto.name,
            subject: dto.subject,
            visibility: dto.visibility,
            inviteCode,
            ownerId,
        },
    });
  }

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
}
