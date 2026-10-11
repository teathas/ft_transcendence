import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BoardSyncService } from './board-sync.service';

@Module({
	imports: [AuthModule],
	providers: [BoardSyncService],
	exports: [BoardSyncService],
})
export class BoardSyncModule {}
