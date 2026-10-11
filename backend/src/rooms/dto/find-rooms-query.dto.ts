import { IsEnum, IsOptional, IsString,IsInt,Min,Max } from 'class-validator';
import { Type } from 'class-transformer';
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

  @IsOptional()
  @Type(() => Number)
  @IsInt() 
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

}