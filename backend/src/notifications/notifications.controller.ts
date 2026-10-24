import { Controller, Get, Patch,Delete, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ListNotificationsDto } from './dto/list-notifications.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}
  @Get()
  list(@Query() query: ListNotificationsDto, @CurrentUser() user: { sub: string }) {
    return this.notificationsService.list(user.sub, query);
  }
  @Get('unread-count')
  async unreadCount(@CurrentUser() user: { sub: string }) {
    const count = await this.notificationsService.unreadCount(user.sub);
    return { count };
  }

  @Get('unread-by-room/:roomId')
  async unreadRoomCounts(@CurrentUser() user: { sub: string },
  @Param('roomId', ParseUUIDPipe) roomId: string) {
    return this.notificationsService.unreadRoomCounts(user.sub,roomId);
  }
  @Patch('read-all')
  markAllRead(@CurrentUser() user: { sub: string }) {
    return this.notificationsService.markAllRead(user.sub);
  }

  @Patch(':id/read')
  markRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.notificationsService.markRead(user.sub, id);
  }

  @Delete(':id')
  deleteNotification(
    @CurrentUser() user: { sub: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.notificationsService.deleteNotification(user.sub, id);
  }

  
}
