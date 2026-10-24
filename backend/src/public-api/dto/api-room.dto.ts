import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Visibility } from '../../generated/prisma/client';

export class ApiRoomDto {
  @ApiProperty({ example: 'Calculus study group', minLength: 1, maxLength: 60 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @ApiProperty({ example: 'Mathematics', minLength: 1, maxLength: 60 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  subject: string;

  @ApiProperty({ enum: Visibility, example: Visibility.PUBLIC })
  @IsEnum(Visibility)
  visibility: Visibility;
}
