import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { RoomQueriesService } from './room-queries.service';
import { RoomFilesService } from './room-files.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [AuthModule, RealtimeModule,NotificationsModule],
  controllers: [RoomsController],
  exports: [RoomsService], 
  providers: [RoomsService, RoomQueriesService, RoomFilesService]
})
export class RoomsModule {}
