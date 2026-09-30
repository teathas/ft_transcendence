import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('me')
	async getMet(@CurrentUser() user: any) {
		return this.usersService.findById(user.sub);
	}
}
