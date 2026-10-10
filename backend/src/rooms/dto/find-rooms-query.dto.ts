import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum RoomSort {
  NEWEST = 'newest',
  ACTIVE = 'active',
  MEMBERS = 'members',
}

export class FindRoomsQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsEnum(RoomSort)
  sort?: RoomSort;
}