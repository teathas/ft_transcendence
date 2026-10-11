import { Logger } from '@nestjs/common';
import {
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Public } from '../auth/decorators/public.decorator';
import { AuthService } from '../auth/auth.service';
import { MessageBody } from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
import { roomChannel, userChannel } from './channels';
import { RealtimeService } from './realtime.service';
import { PresenceService } from './presence.service';

export type SocketUser = { id: string; email: string };

const OFFLINE_GRACE_MS = 5_000;

@Public()
@WebSocketGateway({ destroyUpgrade: false })
export class RealtimeGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server!: Server;

	private readonly logger = new Logger(RealtimeGateway.name);

	constructor(
		private readonly authService: AuthService,
		private readonly prisma: PrismaService,
		private readonly realtime: RealtimeService,
		private readonly presence: PresenceService,
	) { }

	afterInit(server: Server) {
		this.realtime.setServer(server);
		server.use(async (socket, next) => {
			const token = socket.handshake.auth?.token;
			if (typeof token !== 'string' || token.length === 0) {
				this.logger.warn(`rejected ${socket.id}: no token`);
				return next(new Error('Unauthorized'));
			}
			try {
				const payload = await this.authService.verifyAccessToken(token);
				socket.data.user = { id: payload.sub, email: payload.email } satisfies SocketUser;
				next();
			} catch (err) {
				this.logger.warn(`rejected ${socket.id}: ${(err as Error).message}`);
				next(new Error('Unauthorized'));
			}
		});
	}

	async handleConnection(client: Socket) {
		const user = client.data.user as SocketUser;
		void client.join(userChannel(user.id));
		this.logger.log(`connected: ${client.id} user=${user.id}`);

		if (this.presence.addSocket(user.id, client.id)) {
			await this.setStatus(user.id, 'ONLINE');
		}
	}

	async handleDisconnect(client: Socket) {
		const user = client.data.user as SocketUser | undefined;
		this.logger.log(`disconnected: ${client.id} user=${user?.id}`);
		if (!user) return;

		for (const roomId of (client.data.rooms as Set<string> | undefined) ?? []) {
			if (!(await this.usersInRoom(roomId)).includes(user.id)) {
				this.server.to(roomChannel(roomId)).emit('room:user-left', { roomId, userId: user.id });
			}
		}

		if (this.presence.removeSocket(user.id, client.id)) {
			this.presence.scheduleOffline(
				user.id,
				() => void this.setStatus(user.id, 'OFFLINE'),
				OFFLINE_GRACE_MS,
			);
		}
	}

	private async setStatus(userId: string, status: 'ONLINE' | 'OFFLINE') {
		try {
			await this.prisma.user.update({
				where: { id: userId },
				data: status === 'OFFLINE' ? { status, lastSeenAt: new Date() } : { status },
			});
		} catch (err) {
			this.logger.error(`status update failed for ${userId}: ${(err as Error).message}`);
		}
		this.server.emit('presence:update', { userId, status });
	}

	private async usersInRoom(roomId: string): Promise<string[]> {
		const sockets = await this.server.in(roomChannel(roomId)).fetchSockets();
		return [...new Set(sockets.map((s) => (s.data.user as SocketUser).id))];
	}

	@SubscribeMessage('health:ping')
	handlePing(@ConnectedSocket() client: Socket) {
		return { ok: true, userId: (client.data.user as SocketUser).id };
	}

	@SubscribeMessage('presence:list')
	handlePresenceList() {
		return { ok: true, userIds: this.presence.onlineUserIds() };
	}

	@SubscribeMessage('room:join')
	async handleRoomJoin(
		@ConnectedSocket() client: Socket,
		@MessageBody() body: { roomId?: unknown },
	) {
		const user = client.data.user as SocketUser;
		const roomId = body?.roomId;
		if (typeof roomId !== 'string' || roomId.length === 0) {
			return { ok: false, error: 'INVALID_ROOM_ID' };
		}

		const member = await this.prisma.roomMember.findUnique({
			where: { userId_roomId: { userId: user.id, roomId } },
		});
		if (!member) {
			return { ok: false, error: 'NOT_MEMBER' };
		}

		const channel = roomChannel(roomId);
		const before = await this.usersInRoom(roomId);
		const alreadyPresent = before.includes(user.id);

		await client.join(channel);
		(client.data.rooms ??= new Set<string>()).add(roomId);

		if (!alreadyPresent) {
			client.to(channel).emit('room:user-joined', { roomId, userId: user.id });
		}
		return { ok: true, present: alreadyPresent ? before : [...before, user.id] };
	}

	@SubscribeMessage('room:leave')
	async handleRoomLeave(
		@ConnectedSocket() client: Socket,
		@MessageBody() body: { roomId?: unknown },
	) {
		const user = client.data.user as SocketUser;
		const roomId = body?.roomId;
		if (typeof roomId !== 'string' || roomId.length === 0) {
			return { ok: false, error: 'INVALID_ROOM_ID' };
		}

		const channel = roomChannel(roomId);
		if (!client.rooms.has(channel)) return { ok: true };

		await client.leave(channel);
		(client.data.rooms as Set<string> | undefined)?.delete(roomId);

		if (!(await this.usersInRoom(roomId)).includes(user.id)) {
			this.server.to(channel).emit('room:user-left', { roomId, userId: user.id });
		}
		return { ok: true };
	}
}