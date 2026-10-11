import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { sendFriendRequestDto } from './dto/send-friend-request.dto';
import { FriendsService } from './friends.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ListFriendsDto, SearchPageDto } from './dto/list-friends.dto';

@Controller('friends')
export class FriendsController {
	constructor(private friendsService: FriendsService) {}

	@Get()
	getFriends(@CurrentUser() user: { sub: string }, @Query() query: ListFriendsDto) {
		return this.friendsService.getFriends(user.sub, query);
	}

	@Get('summary')
	summary(@CurrentUser() user: { sub: string }) {
		return this.friendsService.summary(user.sub);
	}

	@Get('requests/received')
	getReceived(@CurrentUser() user: { sub: string }, @Query() query: SearchPageDto) {
		return this.friendsService.getReceivedRequests(user.sub, query);
	}

	@Get('requests/sent')
	getSent(@CurrentUser() user: { sub: string }, @Query() query: SearchPageDto) {
		return this.friendsService.getSentRequests(user.sub, query);
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

	@Delete('requests/:id')
	@HttpCode(HttpStatus.NO_CONTENT)
	cancelRequest(
		@CurrentUser() user: { sub: string },
		@Param('id', ParseUUIDPipe) id: string,
	) {
		return this.friendsService.cancelRequest(user.sub, id);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	removeFriend(
		@CurrentUser() user: { sub: string },
		@Param('id', ParseUUIDPipe) id: string,
	) {
		return this.friendsService.removeFriend(user.sub, id);
	}
}
