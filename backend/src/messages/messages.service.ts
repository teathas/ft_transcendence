import { ForbiddenException, Injectable,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto  } from './dto/send-message.dto';
import { ListRoomMessagesDto } from './dto/list-room-messages.dto';
import { MESSAGE_SELECT, MESSAGES_PAGE, toMessageView } from './message-view';
import { RealtimeService } from '../realtime/realtime.service';
import { NotificationsService } from '../notifications/notifications.service';
@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService, private realtime: RealtimeService,  private notificationsService: NotificationsService) {}
    private async assertMember(roomId: string, userId: string) {
        const member = await this.prisma.roomMember.findUnique({
            where: { userId_roomId: { userId, roomId } },
        });
        if (!member)
            throw new ForbiddenException('You are not a member of this room');
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
        const view = toMessageView(message);
        this.realtime.emitToRoom(roomId, 'room:message', { roomId, message: view });
        const members = await this.prisma.roomMember.findMany({
            where: {
            roomId,
            userId: { not: userId },
            },
            select: { userId: true },
        });
        await Promise.all(
            members.map((member) =>
            this.notificationsService.createNotification({
                recipientId: member.userId,
                actorId: userId,
                type: 'NEW_ROOM_MESSAGE',
                data: {
                roomId,
                messageId: message.id,
                },
            }),
            ),
        );
        return view;
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
    async delete(roomId: string, messageId: string, userId: string) {
        await this.assertMember(roomId, userId);
        const existing = await this.prisma.message.findFirst({
            where: {
                id: messageId,
                roomId,
            },
            select: {
                id: true,
                userId: true,
            },
        });

        if (!existing) {
            throw new NotFoundException('Message not found in this room');
        }

        if (existing.userId !== userId) {
            const room = await this.prisma.room.findUnique({
                where: { id: roomId },
                select: { ownerId: true },
            });

            if (!room || room.ownerId !== userId) 
                throw new ForbiddenException('You can only delete your own messages or moderate as the room owner');
        }

        await this.prisma.message.delete({
            where: { id: messageId },
        });
        await this.notificationsService.deleteMatchingNotifications({
            type: 'NEW_ROOM_MESSAGE',
            data: {
                path: ['messageId'],
                equals: messageId,
            },
        });
		if (existing.userId !== userId) {
			await this.notificationsService.createNotification({
				recipientId: existing.userId,
				actorId: userId,
				type: 'ROOM_MESSAGE_DELETED',
				data: { roomId, messageId },
			});
		}
		this.realtime.emitToRoom(roomId, 'room:message-deleted', { roomId, messageId });
        return { message: 'Message deleted successfully' };
    }
}
