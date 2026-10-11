import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

/** `GET /rooms/:id/messages?cursor=&limit=` */
export class ListRoomMessagesDto {
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
