import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DirectMessagesService } from './direct-messages.service';
import { SendDirectMessageDto } from './dto/send-direct-message.dto';
import { ListDirectMessagesDto } from './dto/list-direct-messages.dto';

/** Messages between two friends. Every route needs a signed-in caller. */
@Controller('dm')
export class DirectMessagesController {
	constructor(private directMessages: DirectMessagesService) {}

	@Get()
	conversations(@CurrentUser() user: { sub: string }) {
		return this.directMessages.conversations(user.sub);
	}

	@Get(':friendId/messages')
	thread(
		@CurrentUser() user: { sub: string },
		@Param('friendId', ParseUUIDPipe) friendId: string,
		@Query() query: ListDirectMessagesDto,
	) {
		return this.directMessages.thread(user.sub, friendId, query);
	}

	@Post(':friendId/messages')
	send(
		@CurrentUser() user: { sub: string },
		@Param('friendId', ParseUUIDPipe) friendId: string,
		@Body() dto: SendDirectMessageDto,
	) {
		return this.directMessages.send(user.sub, friendId, dto);
	}

	@Post(':friendId/read')
	@HttpCode(HttpStatus.OK)
	markRead(
		@CurrentUser() user: { sub: string },
		@Param('friendId', ParseUUIDPipe) friendId: string,
	) {
		return this.directMessages.markRead(user.sub, friendId);
	}
}
