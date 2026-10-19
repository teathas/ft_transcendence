import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { RoomQueriesService } from './room-queries.service';
import { RoomFilesService } from './room-files.service';
import { RoomFilesController } from './room-files.controller';

@Module({
  imports: [AuthModule, RealtimeModule],
  controllers: [RoomsController, RoomFilesController],
  exports: [RoomsService], 
  providers: [RoomsService, RoomQueriesService, RoomFilesService]
})
export class RoomsModule {}
