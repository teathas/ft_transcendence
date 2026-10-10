import { Injectable ,ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomsService } from '../rooms/rooms.service';
import { SendMessageDto  } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService,private roomsService: RoomsService,) {}
    async send( roomId:string,userId:string,dto:SendMessageDto )
    {
        const member = await this.prisma.roomMember.findUnique({
            where:{
                userId_roomId:{
                    userId,
                    roomId
                }
            }
        })
        if(!member)
            throw new ForbiddenException('You are not a member of this room');
        await this.roomsService.touchActivity(roomId);
        return this.prisma.message.create({
            data:{
                content : dto.content,
                userId,
                roomId
            }
        })
    }
}
