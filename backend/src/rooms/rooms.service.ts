import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
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
}
