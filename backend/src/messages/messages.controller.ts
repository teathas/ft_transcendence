import { Controller, Body, Get, ParseUUIDPipe, Post, UseGuards, Param, Query, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto  } from './dto/send-message.dto';
import { ListRoomMessagesDto } from './dto/list-room-messages.dto';

@Controller('rooms')
export class MessagesController {
    constructor(private messagesService:MessagesService){}

    @Post(':roomId/messages')
    async send(@Param('roomId') roomId:string,@Body() dto:SendMessageDto ,@Req() req: any)
    {
        const userId = req.user.sub;
        return this.messagesService.send(roomId, userId, dto);

    }

    @Get(':roomId/messages')
    async list(@Param('roomId', ParseUUIDPipe) roomId: string, @Query() query: ListRoomMessagesDto, @Req() req: any)
    {
        return this.messagesService.list(roomId, req.user.sub, query);
    }

    
}
