import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class JoinByCodeDto {
	// Codes are lowercase hex but people type them any way they like.
	@Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
	@IsString()
	@IsNotEmpty()
	@MaxLength(32)
	inviteCode: string;
}
