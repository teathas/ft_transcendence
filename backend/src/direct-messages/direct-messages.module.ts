import { Module } from '@nestjs/common';
import { DirectMessagesController } from './direct-messages.controller';
import { DirectMessagesService } from './direct-messages.service';
import { RealtimeModule } from '../realtime/realtime.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
	imports: [RealtimeModule,NotificationsModule],
	controllers: [DirectMessagesController],
	providers: [DirectMessagesService],
})
export class DirectMessagesModule {}
