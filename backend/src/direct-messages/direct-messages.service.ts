import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PUBLIC_USER_SELECT } from '../users/users.service';
import { friendsOf } from '../friends/utils/friend-filters';
import { toFriendPair } from '../friends/utils/friend-pair';
import { SendDirectMessageDto } from './dto/send-direct-message.dto';
import { ListDirectMessagesDto } from './dto/list-direct-messages.dto';
import { RealtimeService } from '../realtime/realtime.service';
import { NotificationsService } from '../notifications/notifications.service';

const DEFAULT_LIMIT = 30;

/** What a message looks like on the wire. */
const MESSAGE_SELECT = {
  id: true,
  content: true,
  senderId: true,
  receiverId: true,
  createdAt: true,
  readAt: true,
} as const;

@Injectable()
export class DirectMessagesService {
  constructor(
    private prisma: PrismaService,
    private realtime: RealtimeService,
    private  notificationsService: NotificationsService
  ) {}

  /** Only accepted friends can talk to each other. */
  private async assertFriends(meId: string, otherId: string) {
    if (meId === otherId) {
      throw new BadRequestException('You cannot message yourself');
    }

    const { lowId, highId } = toFriendPair(meId, otherId);
    const friendship = await this.prisma.friendship.findUnique({
      where: { lowId_highId: { lowId, highId } },
      select: { status: true },
    });
    if (friendship?.status !== 'ACCEPTED') {
      throw new ForbiddenException('You can only message your friends');
    }
  }

  async send(meId: string, friendId: string, dto: SendDirectMessageDto) {
    await this.assertFriends(meId, friendId);

    const message = await this.prisma.directMessage.create({
      data: { content: dto.content, senderId: meId, receiverId: friendId },
      select: MESSAGE_SELECT,
    });
    this.realtime.emitToUser(friendId, 'dm:message', { message });
    this.realtime.emitToUser(meId, 'dm:message', { message });
    await this.notificationsService.createNotification({
			recipientId: friendId,
			actorId: meId,
			type: 'NEW_DIRECT_MESSAGE',
			data: { messageId: message.id },
		});
    return message;
  }

  /**
   * One page of a conversation, newest first. `nextCursor` is the id to send
   * back as `cursor` for the page of older messages, or null on the last page.
   */
  async thread(meId: string, friendId: string, query: ListDirectMessagesDto) {
    await this.assertFriends(meId, friendId);

    const limit = query.limit ?? DEFAULT_LIMIT;
    const rows = await this.prisma.directMessage.findMany({
      where: {
        OR: [
          { senderId: meId, receiverId: friendId },
          { senderId: friendId, receiverId: meId },
        ],
      },
      select: MESSAGE_SELECT,
      // `id` breaks ties between messages created in the same millisecond, so
      // a page boundary never splits or repeats them.
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      // One more than asked, to know whether an older page exists.
      take: limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
    });

    const items = rows.slice(0, limit);
    return {
      items,
      nextCursor: rows.length > limit ? items[items.length - 1].id : null,
    };
  }

  /** Marks what the friend sent as read. Nothing to check: it is the caller's own inbox. */
  async markRead(meId: string, friendId: string) {
    const { count } = await this.prisma.directMessage.updateMany({
      where: { senderId: friendId, receiverId: meId, readAt: null },
      data: { readAt: new Date() },
    });
    if (count > 0)
      this.realtime.emitToUser(friendId, 'dm:read', { readerId: meId });
    await this.prisma.notification.updateMany({
			where: {
				recipientId: meId,
				actorId: friendId,
				type: 'NEW_DIRECT_MESSAGE',
				readAt: null,
			},
			data: { readAt: new Date() },
		});
    return { updated: count };
  }

  /** A private message can only be removed by the person who sent it. */
  async delete(meId: string, friendId: string, messageId: string) {
    await this.assertFriends(meId, friendId);

    const message = await this.prisma.directMessage.findFirst({
      where: {
        id: messageId,
        OR: [
          { senderId: meId, receiverId: friendId },
          { senderId: friendId, receiverId: meId },
        ],
      },
      select: { senderId: true },
    });
    if (!message)
      throw new NotFoundException('Message not found in this conversation');
    if (message.senderId !== meId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.prisma.directMessage.delete({ where: { id: messageId } });
    this.realtime.emitToUser(meId, 'dm:message-deleted', {
      friendId,
      messageId,
    });
    this.realtime.emitToUser(friendId, 'dm:message-deleted', {
      friendId: meId,
      messageId,
    });
  }

  /**
   * The people the caller has exchanged messages with, most recent first, each
   * with the last message and how many of theirs are still unread.
   */
  async conversations(meId: string) {
    // The last message of each conversation: one row per other person.
    const last = await this.prisma.$queryRaw<
      {
        other: string;
        id: string;
        content: string;
        senderId: string;
        createdAt: Date;
      }[]
    >`
			SELECT DISTINCT ON (other) other, id, content, "senderId", "createdAt"
			FROM (
				SELECT id, content, "senderId", "createdAt",
					CASE WHEN "senderId" = ${meId} THEN "receiverId" ELSE "senderId" END AS other
				FROM "DirectMessage"
				WHERE "senderId" = ${meId} OR "receiverId" = ${meId}
			) AS thread
			ORDER BY other, "createdAt" DESC, id DESC
		`;
    if (last.length === 0) return [];

    const ids = last.map((row) => row.other);

    const [friends, unread] = await Promise.all([
      // Still friends: someone removed from the list leaves the conversations too.
      this.prisma.user.findMany({
        where: { id: { in: ids }, ...friendsOf(meId) },
        select: PUBLIC_USER_SELECT,
      }),
      this.prisma.directMessage.groupBy({
        by: ['senderId'],
        where: { receiverId: meId, readAt: null, senderId: { in: ids } },
        _count: { _all: true },
      }),
    ]);

    const friendById = new Map(friends.map((friend) => [friend.id, friend]));
    const unreadBySender = new Map(
      unread.map((row) => [row.senderId, row._count._all]),
    );

    return last
      .filter((row) => friendById.has(row.other))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 100)
      .map((row) => ({
        friend: friendById.get(row.other),
        lastMessage: {
          id: row.id,
          content: row.content,
          senderId: row.senderId,
          createdAt: row.createdAt,
        },
        unreadCount: unreadBySender.get(row.other) ?? 0,
      }));
  }
}
