import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApiKeyGuard } from './api-key.guard';
import { ApiKeyThrottlerGuard } from './api-key-throttler.guard';
import { PublicApiRoomsController } from './public-api-rooms.controller';
import { PublicApiRoomsService } from './public-api-rooms.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]), NotificationsModule],
  controllers: [PublicApiRoomsController],
  providers: [PublicApiRoomsService, ApiKeyGuard, ApiKeyThrottlerGuard],
})
export class PublicApiModule {}
