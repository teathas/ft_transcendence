import { Type } from 'class-transformer';
import { IsInt, IsObject, Min } from 'class-validator';

export class SaveBoardDto {
	/** The tldraw snapshot, stored as is. */
	@IsObject()
	snapshot: Record<string, unknown>;

	/** The version this save was made from; a newer one on the server refuses it. */
	@Type(() => Number)
	@IsInt()
	@Min(0)
	baseVersion: number;
}
