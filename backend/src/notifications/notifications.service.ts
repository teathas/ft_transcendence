import { Injectable,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { ListNotificationsDto } from './dto/list-notifications.dto';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService , private realtime: RealtimeService,
){}

    async createNotification(input: {
        recipientId: string;
        actorId?: string | null;
        type: Prisma.NotificationCreateInput['type'];
        category?: Prisma.NotificationCreateInput['category'];
        data?: Prisma.InputJsonValue;})
    {
      if (input.type === 'NEW_DIRECT_MESSAGE' && input.actorId) {
        const existing = await this.prisma.notification.findFirst({
          where: {
            recipientId: input.recipientId,
            actorId: input.actorId,
            type: 'NEW_DIRECT_MESSAGE',
            readAt: null,
          },
        });
        if (existing) {
          const notification = await this.prisma.notification.update({
            where: { id: existing.id },
            data: { data: input.data, createdAt: new Date() },
          });
          this.realtime.emitToUser(
            input.recipientId,
            'notification:updated',
            notification,
          );
          return notification;
        }
      }
      const notification = await this.prisma.notification.create({
        data: {
          recipient: { connect: { id: input.recipientId } },
          ...(input.actorId ? { actor: { connect: { id: input.actorId } } }
            : {}),
          type: input.type,
          category: input.category,
          ...(input.data !== undefined ? { data: input.data } : {}),
        },
      });
      this.realtime.emitToUser(
        input.recipientId,
        'notification:new',
        notification,
      );
      return notification;
    }
  async list(userId: string, query: ListNotificationsDto) {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const where = { recipientId:userId,
        ...(query.unreadOnly && { readAt: null }),
        ...(query.category && { category: query.category }), };

      const [items, total] = await this.prisma.$transaction([
        this.prisma.notification.findMany({
          where,
          include: { actor: { select: { id: true, username: true, avatarUrl: true } } },
          orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.notification.count({ where }),
        ]);

        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
  unreadCount(userId: string) {
    return this.prisma.notification.count({ where: { recipientId:userId, readAt: null } });
  }

  async unreadRoomCounts(userId: string, roomId: string) {
    const count = await this.prisma.notification.count({
      where: {
        recipientId: userId,
        category: 'ROOM',
        readAt: null,
        data: {
          path: ['roomId'],
          equals: roomId,
        },
      },
    });

    return { roomId, count };
  }




  async markAllRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { recipientId:userId, readAt: null },
      data: { readAt: new Date() },
    });
    if (result.count > 0) {
      this.realtime.emitToUser(
        userId,
        'notifications:read-all',
        { updated: result.count },
      );
  }
    return { updated: result.count };
  }

  async markRead(userId: string, id: string) {
    const result = await this.prisma.notification.updateMany({
      where: { id, recipientId:userId, readAt: null },
      data: { readAt: new Date() },
    });
    if (result.count > 0) {
      this.realtime.emitToUser(
        userId,
        'notification:read',
        { id },
      );
    }
    else {
      const exists = await this.prisma.notification.findFirst({ where: { id, recipientId:userId } });
      if (!exists) throw new NotFoundException('Notification not found');
    }
    return { success: true };
  }


  async deleteNotification(userId: string, id: string) {
    const result = await this.prisma.notification.deleteMany({
      where: {
        id,
        recipientId:userId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Notification not found');
    }
    this.realtime.emitToUser(
      userId,
      'notification:deleted',
      { id },
    );
    return { success: true };
  }

  async markMatchingNotificationsRead(
    where: Prisma.NotificationWhereInput,
  ) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        ...where,
        readAt: null,
      },
      select: {
        id: true,
        recipientId: true,
      },
    });

    if (notifications.length === 0) {
      return { updated: 0 };
    }
    const now = new Date();
    const result = await this.prisma.notification.updateMany({
      where: {
        id: { in: notifications.map((n) => n.id) },
        readAt: null,
      },
      data: {
        readAt: now,
      },
    });

    for (const notification of notifications) {
      this.realtime.emitToUser(
        notification.recipientId,
        'notification:read',
        { id: notification.id, readAt: now },
      );
    }

    return { updated: result.count };
}
async deleteMatchingNotifications(where: Prisma.NotificationWhereInput) {
  const notifications = await this.prisma.notification.findMany({
    where,
    select: { id: true, recipientId: true },
  });
  if (notifications.length === 0) return { deleted: 0 };

  const result = await this.prisma.notification.deleteMany({
    where: { id: { in: notifications.map((n) => n.id) } },
  });

  for (const n of notifications) {
    this.realtime.emitToUser(n.recipientId, 'notification:deleted', { id: n.id });
  }
  return { deleted: result.count };
}
}



