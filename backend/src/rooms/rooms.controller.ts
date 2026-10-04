
import { Controller, Post, Body, Req, UseGuards,Param } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto  } from './dto/create-room.dto';
import { JoinRoomDto  } from './dto/join-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
    @Post(':roomId/join')
    async join(@Param('roomId') roomId: string,@Body() dto:JoinRoomDto,@Req() req: any)
    {
        const userId = req.user.sub;
        return this.roomsService.join(roomId, userId,dto);
    }
}
