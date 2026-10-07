import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { sendFriendRequestDto } from './dto/send-friend-request.dto';
import { FriendsService } from './friends.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('friends')
export class FriendsController {
	constructor(private friendsService: FriendsService) {}

	@Post('requests')
	async sendRequest(
		@CurrentUser() user: any,
		@Body() dto: sendFriendRequestDto,
	) {
		return this.friendsService.sendRequest(user.sub, dto.addresseeId);
	}
}
