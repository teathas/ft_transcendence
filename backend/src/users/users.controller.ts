import { isAnyNull } from '@prisma/client-runtime-utils';
import {
	Controller, Get, Patch, Param, Body, Post, UseInterceptors, UploadedFile,
	ParseFilePipe, MaxFileSizeValidator, FileTypeValidator,
	Query, Delete, HttpCode, HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { SearchUsersDto } from './dto/search-users.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) { }

	@Get('me')
	async getMet(@CurrentUser() user: any) {
		return this.usersService.findById(user.sub);
	}

	@Get('search')
	async search(@CurrentUser() user: any, @Query() query: SearchUsersDto) {
		return this.usersService.searchUsers(user.sub, query);
	}

	@Get(':id')
	async getProfile(@Param('id') id: string) {
		return this.usersService.findPublicProfile(id);
	}

	@Patch('me')
	async updateMe(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
		return this.usersService.updateProfile(user.sub, dto);
	}

	@Patch('me/password')
	@HttpCode(HttpStatus.NO_CONTENT)
	async changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
		await this.usersService.changePassword(user.sub, dto);
	}

	@Delete('me/avatar')
	async removeAvatar(@CurrentUser() user: any) {
		return this.usersService.removeAvatar(user.sub);
	}

	@Delete('me')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteMe(@CurrentUser() user: any) {
		await this.usersService.deleteAccount(user.sub, user);
	}

	@Post('me/avatar')
	@UseInterceptors(
		FileInterceptor('avatar', {
			storage: memoryStorage(),
			limits: { fileSize: 5 * 1024 * 1024 },
		}),
	)
	async uploadAvatar(
		@CurrentUser() user: any,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
					new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		const uploadDir = join(
			process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads'),
			'avatars',
		);
		await mkdir(uploadDir, { recursive: true });

		const filename = `${randomUUID()}${extname(file.originalname)}`;
		await writeFile(join(uploadDir, filename), file.buffer);

		const avatarUrl = `/uploads/avatars/${filename}`;
		return this.usersService.updateAvatar(user.sub, avatarUrl);
	}

}
