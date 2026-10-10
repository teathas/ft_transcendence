import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { AuthModule } from '../auth/auth.module';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [AuthModule, RoomsModule],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {}
