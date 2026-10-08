
import { Controller, Post, Body, Req,Param, Delete,Get,Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto  } from './dto/create-room.dto';
import { JoinRoomDto  } from './dto/join-room.dto';

@Controller('rooms')
export class RoomsController {
    constructor(private roomsService: RoomsService) { }
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
    @Get('public')
    async findPublicRooms()
    {
        return this.roomsService.findPublicRooms();
    }
    @Get('search')
    async searchByName(@Query('name') name: string)
    {
        return this.roomsService.searchByName(name);
    }
    @Delete(':roomId/leave')
    async leave(@Param('roomId') roomId: string,@Req() req: any)
    {
        const userId = req.user.sub;
        return this.roomsService.leave(roomId, userId);
    }
}
