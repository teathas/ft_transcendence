import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** The room's owner id, once the caller is known to be a member. */
export async function assertMember(prisma: PrismaService, roomId: string, userId: string) {
	const room = await prisma.room.findUnique({
		where: { id: roomId },
		select: { ownerId: true, members: { where: { userId }, select: { userId: true } } },
	});
	if (!room) throw new NotFoundException('Room not found');
	if (room.members.length === 0) {
		throw new ForbiddenException('You are not a member of this room');
	}
	return { ownerId: room.ownerId };
}
