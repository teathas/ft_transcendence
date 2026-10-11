import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PageDto } from '../../common/dto/page.dto';

export const ROOM_STATUSES = ['all', 'active', 'archived'] as const;
/** `mine` is owned or joined: every room the caller is in. */
export const ROOM_OWNERSHIPS = ['all', 'mine', 'owned', 'joined'] as const;
export const ROOM_SORTS = ['recent', 'name', 'participants'] as const;

/** `GET /rooms?search=&subject=&status=&ownership=&sort=&page=&pageSize=` */
export class ListRoomsDto extends PageDto {
	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
	@IsString()
	@MaxLength(60)
	search?: string;

	@IsOptional()
	@IsString()
	@MaxLength(60)
	subject?: string;

	@IsOptional()
	@IsIn(ROOM_STATUSES)
	status?: (typeof ROOM_STATUSES)[number];

	@IsOptional()
	@IsIn(ROOM_OWNERSHIPS)
	ownership?: (typeof ROOM_OWNERSHIPS)[number];

	@IsOptional()
	@IsIn(ROOM_SORTS)
	sort?: (typeof ROOM_SORTS)[number];
}
