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

export type SocketUser = { id: string; email: string };

@Public()
@WebSocketGateway()
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(
	private readonly authService: AuthService,
	private readonly prisma: PrismaService,
	private readonly realtime: RealtimeService,
	) {}

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

  handleConnection(client: Socket) {
    const user = client.data.user as SocketUser;
	void client.join(userChannel(user.id));
    this.logger.log(`connected: ${client.id} user=${user.id}`);
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user as SocketUser | undefined;
    this.logger.log(`disconnected: ${client.id} user=${user?.id}`);
  }

  @SubscribeMessage('health:ping')
  handlePing(@ConnectedSocket() client: Socket) {
    return { ok: true, userId: (client.data.user as SocketUser).id };
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
		where: {userId_roomId: { userId: user.id, roomId } },
	});
	if (!member) {
		return { ok: false, error: 'NOT_MEMBER' };
	}

	const channel = roomChannel(roomId);
	await client.join(channel);
	client.to(channel).emit('room:user-joined', { roomId, userId: user.id });
	return { ok: true };
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
	await client.leave(channel);
	client.to(channel).emit('room:user-left', { roomId, userId: user.id });
	return { ok: true };
  }
}