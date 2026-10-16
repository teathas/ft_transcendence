import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PresenceService implements OnModuleInit, OnModuleDestroy {
	private readonly sockets = new Map<string, Set<string>>();
	private readonly roomUsers = new Map<string, Map<string, Set<string>>>();
	private readonly offlineTimers = new Map<string, ReturnType<typeof setTimeout>>();

	constructor(private readonly prisma: PrismaService) { }

	async onModuleInit() {
		await this.prisma.user.updateMany({
			where: { status: 'ONLINE' },
			data: { status: 'OFFLINE' },
		});
	}

	onModuleDestroy() {
		for (const timer of this.offlineTimers.values()) clearTimeout(timer);
		this.offlineTimers.clear();
	}

	addSocket(userId: string, socketId: string): boolean {
		const pending = this.offlineTimers.get(userId);
		if (pending) {
			clearTimeout(pending);
			this.offlineTimers.delete(userId);
		}

		let set = this.sockets.get(userId);
		if (!set) {
			set = new Set();
			this.sockets.set(userId, set);
		}
		set.add(socketId);
		return set.size === 1 && !pending;
	}

	removeSocket(userId: string, socketId: string): boolean {
		const set = this.sockets.get(userId);
		if (!set) return false;
		set.delete(socketId);
		if (set.size === 0) {
			this.sockets.delete(userId);
			return true;
		}
		return false;
	}

	scheduleOffline(userId: string, onOffline: () => void, delayMs: number) {
		const timer = setTimeout(() => {
			this.offlineTimers.delete(userId);
			if (!this.sockets.has(userId)) onOffline();
		}, delayMs);
		this.offlineTimers.set(userId, timer);
	}

	onlineUserIds(): string[] {
		return [...new Set([...this.sockets.keys(), ...this.offlineTimers.keys()])];
	}

	joinRoom(roomId: string, userId: string, socketId: string): { first: boolean; present: string[] } {
		let users = this.roomUsers.get(roomId);
		if (!users) {
			users = new Map();
			this.roomUsers.set(roomId, users);
		}
		let sockets = users.get(userId);
		if (!sockets) {
			sockets = new Set();
			users.set(userId, sockets);
		}
		const before = sockets.size;
		sockets.add(socketId);
		return { first: before === 0, present: [...users.keys()] };
	}

	leaveRoom(roomId: string, userId: string, socketId: string): boolean {
		const users = this.roomUsers.get(roomId);
		const sockets = users?.get(userId);
		if (!users || !sockets || !sockets.delete(socketId)) return false;
		if (sockets.size > 0) return false;
		users.delete(userId);
		if (users.size === 0) this.roomUsers.delete(roomId);
		return true;
	}

	dropUserFromRoom(roomId: string, userId: string) {
		const users = this.roomUsers.get(roomId);
		users?.delete(userId);
		if (users?.size === 0) this.roomUsers.delete(roomId);
	}
}