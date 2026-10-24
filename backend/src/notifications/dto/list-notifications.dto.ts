import { IsInt, IsOptional, Max, Min, IsBoolean, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { NotificationCategory } from '../../generated/prisma/client';
export class ListNotificationsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  unreadOnly?: boolean;


  @IsOptional()
  @IsEnum(NotificationCategory)
  category?: NotificationCategory;
}