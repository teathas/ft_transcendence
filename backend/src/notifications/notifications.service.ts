import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService){}

    async createNotification(input: {
        recipientId: string;
        actorId?: string | null;
        type: Prisma.NotificationCreateInput['type'];
        data?: Prisma.InputJsonValue;})
    {
       return this.prisma.notification.create({
      data: {
        recipient: { connect: { id: input.recipientId } },
        ...(input.actorId
          ? { actor: { connect: { id: input.actorId } } }
          : {}),
        type: input.type,
        ...(input.data !== undefined ? { data: input.data } : {}),
      },
    });
    }
}
