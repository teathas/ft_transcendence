import { IsUUID } from "class-validator";

export class sendFriendRequestDto {
	@IsUUID()
	addresseeId!: string;
}