import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';
import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InMemorySyncStorage, loadSnapshotIntoStorage, TLSocketRoom } from '@tldraw/sync-core';
import { createTLSchema } from '@tldraw/tlschema';
import { WebSocket, WebSocketServer } from 'ws';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/** At most one write per room in this window while people keep drawing. */
const SAVE_EVERY_MS = 3_000;

const schema = createTLSchema();

type Meta = { userId: string };

interface LiveRoom {
	room: TLSocketRoom<any, Meta>;
	storage: InMemorySyncStorage<any>;
	timer?: ReturnType<typeof setTimeout>;
	/** Saves run one after another, so an older snapshot never lands last. */
	saving: Promise<void>;
}

/**
 * The live whiteboard. A room is opened in memory when its first person connects
 * and closed when the last one leaves; in between, tldraw's sync room orders and
 * broadcasts every change (and the cursors). The document is written to the
 * database shortly after it changes and again when the room closes, so it
 * survives a restart and is what the next person to open the room starts from.
 *
 * Runs inside the API process, on the same port: a client connects to
 * `/sync/:roomId?token=<jwt>`.
 */
@Injectable()
export class BoardSyncService implements OnApplicationBootstrap, OnApplicationShutdown {
	private readonly logger = new Logger(BoardSyncService.name);
	private readonly wss = new WebSocketServer({ noServer: true });
	private readonly rooms = new Map<string, Promise<LiveRoom>>();

	constructor(
		private httpAdapterHost: HttpAdapterHost,
		private jwt: JwtService,
		private prisma: PrismaService,
	) { }

	onApplicationBootstrap() {
		const server = this.httpAdapterHost.httpAdapter.getHttpServer();
		server.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
			const { pathname } = new URL(req.url ?? '', 'http://localhost');
			if (!pathname.startsWith('/sync/')) return; // not ours: Socket.IO handles /socket.io/
			void this.upgrade(req, socket, head);
		});
	}

	async onApplicationShutdown() {
		await Promise.all([...this.rooms.keys()].map((id) => this.close(id, true)));
	}

	private reject(socket: Duplex, status: string) {
		socket.write(`HTTP/1.1 ${status}\r\nConnection: close\r\n\r\n`);
		socket.destroy();
	}

	/** Checks who is asking and whether they belong to the room, then hands over the socket. */
	private async upgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
		try {
			const url = new URL(req.url ?? '', 'http://localhost');
			const match = /^\/sync\/([0-9a-f-]{36})$/i.exec(url.pathname);
			const sessionId = url.searchParams.get('sessionId');
			const token = url.searchParams.get('token');
			if (!match || !sessionId) return this.reject(socket, '400 Bad Request');
			if (!token) return this.reject(socket, '401 Unauthorized');
			const roomId = match[1];

			const payload = await this.jwt.verifyAsync<{ sub: string; jti: string }>(token);
			const revoked = await this.prisma.revokedToken.findUnique({ where: { jti: payload.jti } });
			if (revoked) return this.reject(socket, '401 Unauthorized');

			const member = await this.prisma.roomMember.findUnique({
				where: { userId_roomId: { userId: payload.sub, roomId } },
			});
			if (!member) return this.reject(socket, '403 Forbidden');

			const live = await this.open(roomId);
			this.wss.handleUpgrade(req, socket, head, (ws: WebSocket) => {
				live.room.handleSocketConnect({ sessionId, socket: ws, meta: { userId: payload.sub } });
			});
		} catch (error) {
			// A bad or expired token lands here too.
			this.logger.debug(`Refused a board connection: ${String(error)}`);
			this.reject(socket, '401 Unauthorized');
		}
	}

	/** The room in memory, loaded from the database the first time. */
	private open(roomId: string): Promise<LiveRoom> {
		let live = this.rooms.get(roomId);
		if (!live) {
			live = this.load(roomId).catch((error) => {
				this.rooms.delete(roomId);
				throw error;
			});
			this.rooms.set(roomId, live);
		}
		return live;
	}

	private async load(roomId: string): Promise<LiveRoom> {
		const stored = await this.prisma.room.findUniqueOrThrow({
			where: { id: roomId },
			select: { boardSnapshot: true },
		});

		const storage = new InMemorySyncStorage<any>();
		if (stored.boardSnapshot) {
			// Accepts both the sync format and a plain tldraw store snapshot.
			storage.transaction((txn) =>
				loadSnapshotIntoStorage(txn, schema, stored.boardSnapshot as any),
			);
		}

		const room = new TLSocketRoom<any, Meta>({
			storage,
			schema,
			onSessionRemoved: (_room, { numSessionsRemaining }) => {
				if (numSessionsRemaining === 0) void this.close(roomId);
			},
		});
		const live: LiveRoom = { room, storage, saving: Promise.resolve() };
		// Registered after loading, so opening a room does not count as a change.
		storage.onChange(() => this.schedule(roomId, live));
		return live;
	}

	private schedule(roomId: string, live: LiveRoom) {
		if (live.timer) return;
		live.timer = setTimeout(() => {
			live.timer = undefined;
			void this.save(roomId, live);
		}, SAVE_EVERY_MS);
	}

	private save(roomId: string, live: LiveRoom) {
		const snapshot = live.storage.getSnapshot();
		const now = new Date();

		live.saving = live.saving.then(async () => {
			try {
				await this.prisma.room.update({
					where: { id: roomId },
					data: {
						boardSnapshot: snapshot as unknown as Prisma.InputJsonValue,
						boardVersion: { increment: 1 },
						boardUpdatedAt: now,
						lastActiveAt: now,
					},
				});
			} catch (error) {
				// The room may have been deleted while people were in it.
				this.logger.warn(`Could not save the board of ${roomId}: ${String(error)}`);
			}
		});
		return live.saving;
	}

	/** Writes the last state, then frees the memory — unless someone came back meanwhile. */
	private async close(roomId: string, force = false) {
		const pending = this.rooms.get(roomId);
		if (!pending) return;
		const live = await pending.catch(() => undefined);
		if (!live) return;

		clearTimeout(live.timer);
		live.timer = undefined;
		await this.save(roomId, live);

		if (!force && live.room.getNumActiveSessions() > 0) return;
		live.room.close();
		this.rooms.delete(roomId);
	}
}
