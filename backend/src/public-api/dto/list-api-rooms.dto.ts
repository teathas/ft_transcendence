import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PageDto } from '../../common/dto/page.dto';
import { Visibility } from '../../generated/prisma/client';

export const API_ROOM_OWNERSHIPS = ['all', 'owned', 'joined'] as const;

export class ListApiRoomsDto extends PageDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  declare page?: number;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 50 })
  declare pageSize?: number;

  @ApiPropertyOptional({
    description: 'Search in the room name and subject',
    example: 'mathematics',
    maxLength: 60,
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(60)
  search?: string;

  @ApiPropertyOptional({
    enum: Visibility,
    description: 'Filter by visibility',
  })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;

  @ApiPropertyOptional({
    enum: API_ROOM_OWNERSHIPS,
    default: 'all',
    description: 'All memberships, rooms you own, or rooms you joined',
  })
  @IsOptional()
  @IsIn(API_ROOM_OWNERSHIPS)
  ownership?: (typeof API_ROOM_OWNERSHIPS)[number];
}
