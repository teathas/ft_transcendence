
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('rooms')
export class RoomsController {
    constructor(private roomsService: RoomsService) { }
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() dto:CreateRoomDto,@Req() req: any)
    {
        const ownerId = req.user.sub;
        return this.roomsService.create(dto, ownerId);
    }
}
