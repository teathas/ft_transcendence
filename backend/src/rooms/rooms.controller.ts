
import { Controller, Post, Body, Req } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
    constructor(private roomsService: RoomsService) { }
    @UseGuards(JwtAuthGuard)
    @Post('rooms')
    async create(@Body() dto:CreateRoomDto, @Req() req)
    {
        const ownerId = req.user.sub;
        return this.roomsService.create(dto, ownerId);
    }
    
}
