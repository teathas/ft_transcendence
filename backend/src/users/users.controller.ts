import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('me')
	async getMet(@CurrentUser() user: any) {
		return this.usersService.findById(user.sub);
	}

	@Patch('me')
	async updateMe(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
		return this.usersService.updateProfile(user.sub, dto);
	}
}
