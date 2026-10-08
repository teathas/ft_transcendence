import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { sendFriendRequestDto } from './dto/send-friend-request.dto';
import { FriendsService } from './friends.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';

@Controller('friends')
export class FriendsController {
	constructor(private friendsService: FriendsService) {}

	@Get()
	getFriends(@CurrentUser() user: { sub: string }) {
		return this.friendsService.getFriends(user.sub);
	}

	@Get('requests/received')
	getReceived(@CurrentUser() user: { sub: string }) {
		return this.friendsService.getReceivedRequests(user.sub);
	}

	@Get('requests/sent')
	getSent(@CurrentUser() user: { sub: string }) {
		return this.friendsService.getSentRequests(user.sub);
	}

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

	@Post('requests/:id/reject')
	@HttpCode(HttpStatus.NO_CONTENT)
	async reject(
		@CurrentUser() user: any,
		@Param('id', ParseUUIDPipe) id: string,
	) {
		return this.friendsService.rejectRequest(user.sub, id);
	}
}
