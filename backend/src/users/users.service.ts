import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { unlink } from 'fs/promises';
import { basename, join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { pageArgs, Paged } from '../common/dto/page.dto';
import { relationshipFilter } from '../friends/utils/friend-filters';
import { NotificationsService } from '../notifications/notifications.service';

export const PUBLIC_USER_SELECT = {
	id: true,
	username: true,
	avatarUrl: true,
	bio: true,
	status: true,
} as const;

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService, private notifications: NotificationsService) {}

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
				_count: {
					select: {
						rooms: true,
						roomMemberships: true,
						messages: true,
						roomFiles: true,
					},
				},
			},
		});
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const { _count, ...profile } = user;
		return {
			...profile,
			stats: {
				roomsJoined: _count.roomMemberships,
				roomsOwned: _count.rooms,
				messagesSent: _count.messages,
				filesShared: _count.roomFiles,
			},
		};
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

		if (dto.email) {
			const existing = await this.prisma.user.findUnique({
				where: { email: dto.email },
			});
			if (existing && existing.id !== id) {
				throw new ConflictException('Email already in use');
			}
		}

		// Field by field rather than `data: dto`, so only what the DTO declares can
		// ever reach the database.
		const updated = await this.prisma.user.update({
			where: { id },
			data: {
				...(dto.username !== undefined && { username: dto.username }),
				...(dto.email !== undefined && { email: dto.email }),
				// An empty bio is stored as "no bio".
				...(dto.bio !== undefined && { bio: dto.bio.trim() || null }),
			},
		});

		const { passwordHash: _, ...safeUser } = updated;
		await this.notifications.createNotification({ recipientId: id, actorId: id, type: 'PROFILE_UPDATED' });
		return safeUser;
	}

	async changePassword(id: string, dto: ChangePasswordDto) {
		const user = await this.prisma.user.findUnique({ where: { id } });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const matches = await bcrypt.compare(dto.currentPassword, user.passwordHash);
		// A 400, not a 401: a 401 would make the client think its session expired.
		if (!matches) {
			throw new BadRequestException('Current password is incorrect');
		}

		await this.prisma.user.update({
			where: { id },
			data: { passwordHash: await bcrypt.hash(dto.newPassword, 10) },
		});
		await this.notifications.createNotification({ recipientId: id, actorId: id, type: 'PASSWORD_CHANGED' });
	}

	async updateAvatar(id: string, avatarUrl: string) {
		const updated = await this.prisma.user.update({
			where: { id },
			data: { avatarUrl },
		});

		const { passwordHash: _, ...safeUser } = updated;
		await this.notifications.createNotification({ recipientId: id, actorId: id, type: 'AVATAR_UPDATED' });
		return safeUser;
	}

	async removeAvatar(id: string) {
		const user = await this.findById(id);

		const updated = await this.prisma.user.update({
			where: { id },
			data: { avatarUrl: null },
		});
		await this.deleteAvatarFile(user.avatarUrl);

		const { passwordHash: _, ...safeUser } = updated;
		await this.notifications.createNotification({ recipientId: id, actorId: id, type: 'AVATAR_UPDATED' });
		return safeUser;
	}

	/**
	 * Removes the account, and with it everything that cannot outlive it. The
	 * rooms the user owns go too, together with their members and messages —
	 * that is what the profile page warns about.
	 *
	 * Friendships and direct messages cascade on their own (see the schema); the
	 * rest has no `onDelete` rule and is cleared here, in one transaction.
	 */
	async deleteAccount(id: string, token: { jti: string; exp: number }) {
		const user = await this.findById(id);

		const owned = await this.prisma.room.findMany({
			where: { ownerId: id },
			select: { id: true },
		});
		const ownedIds = owned.map((room) => room.id);

		await this.prisma.$transaction([
			this.prisma.message.deleteMany({
				where: { OR: [{ userId: id }, { roomId: { in: ownedIds } }] },
			}),
			this.prisma.roomMember.deleteMany({
				where: { OR: [{ userId: id }, { roomId: { in: ownedIds } }] },
			}),
			this.prisma.room.deleteMany({ where: { id: { in: ownedIds } } }),
			// The token outlives the account otherwise.
			this.prisma.revokedToken.upsert({
				where: { jti: token.jti },
				update: {},
				create: { jti: token.jti, expiresAt: new Date(token.exp * 1000) },
			}),
			this.prisma.user.delete({ where: { id } }),
		]);

		await this.deleteAvatarFile(user.avatarUrl);
	}

	/** Best effort: a file that is already gone is not an error. */
	private async deleteAvatarFile(avatarUrl: string | null) {
		if (!avatarUrl?.startsWith('/uploads/avatars/')) return;

		const uploads = process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads');
		try {
			// `basename`, so a stored value can never point outside the folder.
			await unlink(join(uploads, 'avatars', basename(avatarUrl)));
		} catch {
			// Nothing to remove.
		}
	}

	/**
	 * People whose username contains `q`, never the caller, one page at a time,
	 * each with their relationship to the caller.
	 */
	async searchUsers(meId: string, query: SearchUsersDto): Promise<Paged<unknown>> {
		const where: Prisma.UserWhereInput = {
			id: { not: meId },
			username: { contains: query.q, mode: 'insensitive' },
			...relationshipFilter(meId, query.relationship),
		};

		const [users, total] = await this.prisma.$transaction([
			this.prisma.user.findMany({
				where,
				select: PUBLIC_USER_SELECT,
				orderBy: { username: 'asc' },
				...pageArgs(query),
			}),
			this.prisma.user.count({ where }),
		]);

		if (users.length === 0) return { items: [], total };

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

		return {
			items: users.map((u) => ({
				...u,
				relationship: relationByUserId.get(u.id) ?? 'none',
			})),
			total,
		};
	}
}
