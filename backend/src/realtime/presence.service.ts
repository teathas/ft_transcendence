import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { roomChannel } from './channels';
import { RealtimeService } from './realtime.service';

/** A reload drops the socket for a moment; this long without one means gone. */
const GRACE_MS = 5_000;

/**
 * Who is online. A person counts as online while at least one of their
 * sockets is connected (several tabs are one person), and goes offline only
 * after the grace period, so reloading a page does not flicker.
 */
@Injectable()
export class PresenceService implements OnApplicationBootstrap {
	private readonly connections = new Map<string, number>();
	private readonly online = new Set<string>();
	private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

	constructor(
		private prisma: PrismaService,
		private realtime: RealtimeService,
	) {}

	/** Nobody is connected right after a start, whatever the database says. */
	async onApplicationBootstrap() {
		await this.prisma.user.updateMany({
			where: { status: 'ONLINE' },
			data: { status: 'OFFLINE' },
		});
	}

	connected(userId: string) {
		clearTimeout(this.timers.get(userId));
		this.timers.delete(userId);
		this.connections.set(userId, (this.connections.get(userId) ?? 0) + 1);
		if (!this.online.has(userId)) void this.change(userId, 'ONLINE');
	}

	disconnected(userId: string) {
		const left = (this.connections.get(userId) ?? 1) - 1;
		if (left > 0) return void this.connections.set(userId, left);
		this.connections.delete(userId);

		this.timers.set(
			userId,
			setTimeout(() => {
				this.timers.delete(userId);
				if (!this.connections.has(userId)) void this.change(userId, 'OFFLINE');
			}, GRACE_MS),
		);
	}

	private async change(userId: string, status: 'ONLINE' | 'OFFLINE') {
		if (status === 'ONLINE') this.online.add(userId);
		else this.online.delete(userId);

		try {
			const lastSeenAt = new Date();
			await this.prisma.user.update({ where: { id: userId }, data: { status, lastSeenAt } });

			const [rooms, friendships] = await Promise.all([
				this.prisma.roomMember.findMany({ where: { userId }, select: { roomId: true } }),
				this.prisma.friendship.findMany({
					where: { status: 'ACCEPTED', OR: [{ requesterId: userId }, { addresseeId: userId }] },
					select: { requesterId: true, addresseeId: true },
				}),
			]);

			const payload = { userId, status, lastSeenAt };
			// Whoever has one of your rooms open, and your friends.
			for (const { roomId } of rooms) {
				this.realtime.emitToRoom(roomId, 'presence:changed', payload);
			}
			this.realtime.emitToUsers(
				friendships.map((f) => (f.requesterId === userId ? f.addresseeId : f.requesterId)),
				'presence:changed',
				payload,
			);
		} catch {
			// The account may have been deleted meanwhile.
		}
	}
}
