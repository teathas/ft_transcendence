import { Injectable, Logger } from "@nestjs/common";
import { Server } from "socket.io";
import { roomChannel, userChannel } from "./channels";

@Injectable()
export class RealtimeService {
	private server: Server | null = null;
	private readonly logger = new Logger(RealtimeService.name);

	setServer(server: Server) {
		this.server = server;
	}

	emitToRoom(roomId: string, event: string, payload: unknown) {
		if (!this.server) return this.logger.warn(`server not ready, dropped ${event}`);
		this.server.to(roomChannel(roomId)).emit(event, payload);
	}

	emitToUser(userId: string, event: string, payload: unknown) {
		if (!this.server) return this.logger.warn(`server not ready, dropped ${event}`);
		this.server.to(userChannel(userId)).emit(event, payload);
	}

	removeUserFromRoom(userId: string, roomId: string) {
		if (!this.server) return;
		this.server.in(userChannel(userId)).socketsLeave(roomChannel(roomId));
	}
}