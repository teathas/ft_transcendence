import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

export const PUBLIC_USER_SELECT = {
	id: true,
	username: true,
	avatarUrl: true,
	bio: true,
	status: true,
} as const;

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

	async findPublicProfile(id: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				username: true,
				avatarUrl: true,
				bio: true,
				status: true,
			},
		});
		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
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

	async updateAvatar(id: string, avatarUrl: string) {
		const updated = await this.prisma.user.update({
			where: { id },
			data: { avatarUrl },
		});

		const { passwordHash: _, ...safeUser } = updated;
		return safeUser;
	}

	async searchUsers(meId: string, q: string) {
		const users = await this.prisma.user.findMany({
			where: {
				username: { contains: q, mode: 'insensitive' },
				id: { not: meId },
			},
			select: PUBLIC_USER_SELECT,
			orderBy: { username: 'asc' },
			take: 20,
		});

		if (users.length === 0) return [];
		
		const ids = users.map((u) => u.id);

		const friendships = await this.prisma.friendship.findMany({
			where: {
				OR: [
						{ requesterId: meId, addresseeId: { in: ids } },
						{ addresseeId: meId, requesterId: { in: ids } },
				],
			},
			select: { requesterId: true, addresseeId: true, status: true },
		});

		const relationByUserId = new Map<string, 'sent' | 'received' | 'friends'>();
		for (const f of friendships) {
			const otherId = f.requesterId === meId ? f.addresseeId : f.requesterId;
			if (f.status === 'ACCEPTED') relationByUserId.set(otherId, 'friends');
			else if (f.requesterId === meId) relationByUserId.set(otherId, 'sent');
			else relationByUserId.set(otherId, 'received');
		}

		return users.map((u) => ({
			...u,
			relationship: relationByUserId.get(u.id) ?? 'none',
		}));
	}
}
