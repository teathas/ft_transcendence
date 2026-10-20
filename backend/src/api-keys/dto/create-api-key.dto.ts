import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateApiKeyDto {
  @ApiProperty({ example: 'My integration', minLength: 1, maxLength: 60 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  name: string;

  @ApiPropertyOptional({
    example: '2027-10-20T12:00:00.000Z',
    description: 'Optional ISO 8601 expiration date',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
