import { Controller , Body ,Post , UseGuards,Param , Req} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendMessageDto  } from './dto/send-message.dto';

@Controller('rooms')
export class MessagesController {
    constructor(private messagesService:MessagesService){}

    @UseGuards(JwtAuthGuard)
    @Post(':roomId/messages')
    async send(@Param('roomId') roomId:string,@Body() dto:SendMessageDto ,@Req() req: any)
    {
        const userId = req.user.sub;
        return this.messagesService.send(roomId, userId, dto);

    }

    
}
