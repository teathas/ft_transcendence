import { IsEnum } from 'class-validator';
import { RoomNotificationPreference } from '../../generated/prisma/client';

export class UpdateNotificationPreferenceDto {
  @IsEnum(RoomNotificationPreference)
  preference: RoomNotificationPreference;
}