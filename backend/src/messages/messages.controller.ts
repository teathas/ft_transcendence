import { Controller, Body, Get, ParseUUIDPipe, Post, Param, Query, Req, Delete  } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto  } from './dto/send-message.dto';
import { ListRoomMessagesDto } from './dto/list-room-messages.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('rooms')
export class MessagesController {
    constructor(private messagesService:MessagesService){}

    @Post(':roomId/messages')
    async send(@Param('roomId', ParseUUIDPipe) roomId:string, @Body() dto:SendMessageDto ,@CurrentUser() user: { sub: string })
    {
        return this.messagesService.send(roomId, user.sub, dto);
    }
    @Get(':roomId/messages')
    async list(@Param('roomId', ParseUUIDPipe) roomId: string, @Query() query: ListRoomMessagesDto, @CurrentUser() user: { sub: string })
    {
        return this.messagesService.list(roomId, user.sub, query);
    }

    @Delete(':roomId/messages/:messageId')
    async delete(@Param('roomId', ParseUUIDPipe) roomId: string,@Param('messageId', ParseUUIDPipe) messageId: string,@CurrentUser() user: { sub: string })
    {
        return this.messagesService.delete(roomId, messageId, user.sub);
    }
}
