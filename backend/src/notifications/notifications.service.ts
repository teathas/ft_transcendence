import { Injectable,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { ListNotificationsDto } from './dto/list-notifications.dto';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService){}

    async createNotification(input: {
        recipientId: string;
        actorId?: string | null;
        type: Prisma.NotificationCreateInput['type'];
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
          return this.prisma.notification.update({
            where: { id: existing.id },
            data: { data: input.data, createdAt: new Date() },
          });
        }
      }
       return this.prisma.notification.create({
      data: {
        recipient: { connect: { id: input.recipientId } },
        ...(input.actorId ? { actor: { connect: { id: input.actorId } } }
          : {}),
        type: input.type,
        ...(input.data !== undefined ? { data: input.data } : {}),
      },
    });
    }
  async list(userId: string, query: ListNotificationsDto) {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const where = { userId, ...(query.unreadOnly && { readAt: null }) };

      const [items, total] = await this.prisma.$transaction([
        this.prisma.notification.findMany({
          where,
          orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.notification.count({ where }),
        ]);

        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
  unreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, readAt: null } });
  }
  async markAllRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { updated: result.count };
  }

  async markRead(userId: string, id: string) {
  const result = await this.prisma.notification.updateMany({
    where: { id, userId, readAt: null },
    data: { readAt: new Date() },
  });
  if (result.count === 0) {
    const exists = await this.prisma.notification.findFirst({ where: { id, userId } });
    if (!exists) throw new NotFoundException('Notification not found');
  }
  return { success: true };
}
}
