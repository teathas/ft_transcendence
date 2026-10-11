import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/** `?page=2&pageSize=12`, shared by every list endpoint. */
export class PageDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	// Capped, so a hand-written `?pageSize=100000` cannot ask for a whole table.
	@Max(50)
	pageSize?: number;
}

/** What Prisma needs to fetch one page, with the defaults filled in. */
export function pageArgs(query: PageDto) {
	const page = query.page ?? 1;
	const pageSize = query.pageSize ?? 12;
	return { skip: (page - 1) * pageSize, take: pageSize };
}

/** The envelope every list endpoint answers with. */
export interface Paged<T> {
	items: T[];
	total: number;
}
