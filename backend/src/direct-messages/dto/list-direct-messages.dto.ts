import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

/** `?cursor=<id of the oldest message already loaded>&limit=30`. */
export class ListDirectMessagesDto {
	@IsOptional()
	@IsUUID()
	cursor?: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(50)
	limit?: number;
}
