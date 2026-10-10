import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { RoomQueriesService } from './room-queries.service';
import { RoomFilesService } from './room-files.service';
import { RoomBoardService } from './room-board.service';

@Module({
  imports: [AuthModule, RealtimeModule],
  controllers: [RoomsController],
  exports: [RoomsService], 
  providers: [RoomsService, RoomQueriesService, RoomFilesService, RoomBoardService]
})
export class RoomsModule {}
