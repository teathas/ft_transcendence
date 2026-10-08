import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { sendFriendRequestDto } from './dto/send-friend-request.dto';
import { FriendsService } from './friends.service';
import { Body, Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';

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

	@Post('requests/:id/accept')
	@HttpCode(HttpStatus.OK)
	async accept(
		@CurrentUser() user: any,
		@Param('id', ParseUUIDPipe) id: string,
	) {
		return this.friendsService.acceptRequest(user.sub, id);
	}

	@Post('request/:id/reject')
	@HttpCode(HttpStatus.NO_CONTENT)
	async reject(
		@CurrentUser() user: any,
		@Param('id', ParseUUIDPipe) id: string,
	) {
		return this.friendsService.rejectRequest(user.sub, id);
	}
}
