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

export type SocketUser = { id: string; email: string };

@Public()
@WebSocketGateway()
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(private readonly authService: AuthService) {}

  afterInit(server: Server) {
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
}