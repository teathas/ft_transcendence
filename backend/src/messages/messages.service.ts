import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomsService } from '../rooms/rooms.service';
import { SendMessageDto  } from './dto/send-message.dto';

import { ListRoomMessagesDto } from './dto/list-room-messages.dto';
import { MESSAGE_SELECT, MESSAGES_PAGE, toMessageView } from './message-view';


@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService,private roomsService: RoomsService,) {}


    private async assertMember(roomId: string, userId: string) {

        const member = await this.prisma.roomMember.findUnique({
            where: { userId_roomId: { userId, roomId } },
        });
        if (!member)
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

    async send(roomId: string, userId: string, dto: SendMessageDto) {
        await this.assertMember(roomId, userId);

        const [message] = await this.prisma.$transaction([
            this.prisma.message.create({
                data: { content: dto.content, userId, roomId },
                select: MESSAGE_SELECT,
            }),
            this.prisma.room.update({
                where: { id: roomId },
                data: { lastActiveAt: new Date() },
            }),
        ]);
        return toMessageView(message);
    }

    /**
     * One page of history, newest first. `nextCursor` is the id to send back as
     * `cursor` for older messages, or null on the last page.
     */
    async list(roomId: string, userId: string, query: ListRoomMessagesDto) {
        await this.assertMember(roomId, userId);

        const limit = query.limit ?? MESSAGES_PAGE;
        const rows = await this.prisma.message.findMany({
            where: { roomId },
            select: MESSAGE_SELECT,
            // `id` breaks ties between messages created in the same millisecond.
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
            ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
        });

        const items = rows.slice(0, limit);
        return {
            items: items.map(toMessageView),
            nextCursor: rows.length > limit ? items[items.length - 1].id : null,
        };
    }
}
