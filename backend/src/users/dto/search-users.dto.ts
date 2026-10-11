import { Transform } from 'class-transformer'
import { IsIn, IsOptional, IsString, Length } from 'class-validator'
import { PageDto } from '../../common/dto/page.dto';
import { RELATIONSHIPS, type RelationshipFilter } from '../../friends/utils/friend-filters';

export class SearchUsersDto extends PageDto {
	@Transform(({ value }: { value: unknown }) =>
		typeof value === 'string' ? value.trim() : value,
	)
	@IsString()
	@Length(1, 20)
	q!: string;

	/** Only people in this relationship with the caller; `all` by default. */
	@IsOptional()
	@IsIn(RELATIONSHIPS)
	relationship?: RelationshipFilter;
}