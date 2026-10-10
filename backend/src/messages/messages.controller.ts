import { Controller , Body ,Post ,Param , Req} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto  } from './dto/send-message.dto';

@Controller('rooms')
export class MessagesController {
    constructor(private messagesService:MessagesService){}

    @Post(':roomId/messages')
    async send(@Param('roomId') roomId:string,@Body() dto:SendMessageDto ,@Req() req: any)
    {
        const userId = req.user.sub;
        return this.messagesService.send(roomId, userId, dto);

    }

    
}
