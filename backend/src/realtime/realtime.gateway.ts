import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Public } from '../auth/decorators/public.decorator';

@Public()
@WebSocketGateway()
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`disconnected: ${client.id}`);
  }

  @SubscribeMessage('health:ping')
  handlePing() {
    return { ok: true, time: Date.now() };
  }
}