import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PageDto } from '../../common/dto/page.dto';

/** `?search=ali&page=1&pageSize=12`: a page of a list, narrowed by username. */
export class SearchPageDto extends PageDto {
	@IsOptional()
	@Transform(({ value }: { value: unknown }) =>
		typeof value === 'string' ? value.trim() : value,
	)
	@IsString()
	@MaxLength(20)
	search?: string;
}

export const FRIEND_SORTS = ['recent', 'name'] as const;
export type FriendSort = (typeof FRIEND_SORTS)[number];

export class ListFriendsDto extends SearchPageDto {
	/** `recent` is newest friendship first; `name` is the friend's username. */
	@IsOptional()
	@IsIn(FRIEND_SORTS)
	sort?: FriendSort;
}
