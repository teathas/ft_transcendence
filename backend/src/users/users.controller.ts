import { isAnyNull } from '@prisma/client-runtime-utils';
import {
	Controller, Get, Patch, Param, Body, Post, UseInterceptors, UploadedFile,
	Delete, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator,
	Query,
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

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) { }

	@Get('me')
	async getMet(@CurrentUser() user: any) {
		return this.usersService.findById(user.sub);
	}

	@Get('search')
	async search(@CurrentUser() user: any, @Query() query: SearchUsersDto) {
		return this.usersService.searchUsers(user.sub, query.q);
	}

	@Get(':id')
	async getProfile(@Param('id') id: string) {
		return this.usersService.findPublicProfile(id);
	}

	@Patch('me')
	async updateMe(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
		return this.usersService.updateProfile(user.sub, dto);
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

	@Delete('me/avatar')
	async removeAvatar(@CurrentUser() user: any) {
		return this.usersService.removeAvatar(user.sub);
	}
}
