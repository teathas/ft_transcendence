import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PresenceService implements OnModuleInit {
	private readonly sockets = new Map<string, Set<string>>();

	constructor(private readonly prisma: PrismaService) {}

	async onModuleInit() {
		await this.prisma.user.updateMany({
			where: { status: 'ONLINE' },
			data: { status: 'OFFLINE' },
		});
	}
	
	addSocket(userId: string, socketId: string): boolean {
		let set = this.sockets.get(userId);
		if (!set) {
			set = new Set();
			this.sockets.set(userId, set);
		}
		set.add(socketId);
		return set.size === 1;
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

	onlineUserIds(): string[] {
		return [...this.sockets.keys()];
	}

}