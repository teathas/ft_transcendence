import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async findById(id: string)
	{
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const { passwordHash: _, ...safeUser } = user;
		return safeUser;
	}

	async updateProfile(id: string, dto: UpdateUserDto) {
		if (dto.username) {
			const existing = await this.prisma.user.findUnique({
				where: { username: dto.username },
			});
			if (existing && existing.id !== id) {
				throw new ConflictException('Username already taken');
			}
		}

		const updated = await this.prisma.user.update({
			where: { id },
			data: dto,
		});

		const { passwordHash: _, ...safeUser } = updated;
		return safeUser;
	}

}
