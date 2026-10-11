import { PrismaClientKnownRequestError } from '@prisma/client-runtime-utils';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toFriendPair } from './utils/friend-pair';
import { Prisma } from '../generated/prisma/client';
import { PUBLIC_USER_SELECT } from '../users/users.service';
import { pageArgs, Paged } from '../common/dto/page.dto';
import { friendsOf } from './utils/friend-filters';
import { ListFriendsDto, SearchPageDto } from './dto/list-friends.dto';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class FriendsService {
	constructor(
		private prisma: PrismaService,
		private realtime: RealtimeService,
	) {}

	/** Tells someone their friends or requests changed, so their screens refresh. */
	private notify(userId: string) {
		this.realtime.emitToUser(userId, 'friends:changed', {});
	}

	async sendRequest(meId: string, addresseeId: string) {
		if (meId === addresseeId) {
			throw new BadRequestException('You cannot send a friend request to yourself');
		}

		const target = await this.prisma.user.findUnique({
			where: { id: addresseeId },
			select: { id: true },
		});
		if (!target) {
			throw new NotFoundException('User not found');
		}

		const { lowId, highId } = toFriendPair(meId, addresseeId);

		try {
			const created = await this.prisma.friendship.create({
				data: { requesterId: meId, addresseeId, lowId, highId },
				select: { id: true, status: true, addresseeId: true, createdAt: true },
			});
			this.notify(addresseeId);
			return created;
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
				const existing = await this.prisma.friendship.findUnique({
					where: { lowId_highId: { lowId, highId } },
					select: { status: true, requesterId: true },
				});
				if (existing) {
					if (existing.status === 'ACCEPTED') {
						throw new ConflictException('Already friends');
					}
					if (existing.requesterId === meId) {
						throw new ConflictException('Request already sent');
					}
					throw new ConflictException('This user already sent you a request, accept it',);
				}
			}
			throw e;
		}
	}

	async acceptRequest(meId: string, id: string) {
		const request = await this.prisma.friendship.findFirst({
			where: { id, addresseeId: meId, status: 'PENDING' },
			select: { requesterId: true },
		});
		const result = await this.prisma.friendship.updateMany({
			where: { id, addresseeId: meId, status: 'PENDING' },
			data: { status: 'ACCEPTED' },
		});
		if (!request || result.count === 0) {
			throw new NotFoundException('Friend request not found');
		}
		this.notify(request.requesterId);
		return { id, status: 'ACCEPTED' };
	}

	async rejectRequest(meId: string, id: string) {
		const request = await this.prisma.friendship.findFirst({
			where: { id, addresseeId: meId, status: 'PENDING' },
			select: { requesterId: true },
		});
		const result = await this.prisma.friendship.deleteMany({
			where: { id, addresseeId: meId, status: 'PENDING' },
		});
		if (!request || result.count === 0) {
			throw new NotFoundException('Friend request not found');
		}
		this.notify(request.requesterId);
	}

	/** The username filter, as Prisma wants it; empty when nothing was typed. */
	private usernameLike(search?: string): Prisma.UserWhereInput {
		return search ? { username: { contains: search, mode: 'insensitive' } } : {};
	}

	/** The caller's friends, one page at a time. */
	async getFriends(meId: string, query: ListFriendsDto): Promise<Paged<unknown>> {
		const paging = pageArgs(query);
		const nameFilter = this.usernameLike(query.search);

		if (query.sort === 'name') {
			// Read through the users themselves: a friendship has the friend on one
			// side or the other, so only the users can be ordered by username.
			const where: Prisma.UserWhereInput = {
				id: { not: meId },
				...nameFilter,
				...friendsOf(meId),
			};
			const [users, total] = await this.prisma.$transaction([
				this.prisma.user.findMany({
					where,
					select: PUBLIC_USER_SELECT,
					orderBy: { username: 'asc' },
					...paging,
				}),
				this.prisma.user.count({ where }),
			]);

			const ids = users.map((user) => user.id);
			const rows = await this.prisma.friendship.findMany({
				where: {
					status: 'ACCEPTED',
					OR: [
						{ requesterId: meId, addresseeId: { in: ids } },
						{ addresseeId: meId, requesterId: { in: ids } },
					],
				},
				select: { id: true, updatedAt: true, requesterId: true, addresseeId: true },
			});
			const friendshipOf = new Map(
				rows.map((row) => [row.requesterId === meId ? row.addresseeId : row.requesterId, row]),
			);

			return {
				items: users.map((user) => ({
					friendshipId: friendshipOf.get(user.id)?.id,
					since: friendshipOf.get(user.id)?.updatedAt,
					user,
				})),
				total,
			};
		}

		const where: Prisma.FriendshipWhereInput = {
			status: 'ACCEPTED',
			OR: [
				{ requesterId: meId, addressee: nameFilter },
				{ addresseeId: meId, requester: nameFilter },
			],
		};
		const [rows, total] = await this.prisma.$transaction([
			this.prisma.friendship.findMany({
				where,
				select: {
					id: true,
					updatedAt: true,
					requesterId: true,
					requester: { select: PUBLIC_USER_SELECT },
					addressee: { select: PUBLIC_USER_SELECT },
				},
				// Accepting is the only update a friendship ever gets, so this is the
				// moment the two became friends.
				orderBy: { updatedAt: 'desc' },
				...paging,
			}),
			this.prisma.friendship.count({ where }),
		]);

		return {
			items: rows.map((row) => ({
				friendshipId: row.id,
				since: row.updatedAt,
				user: row.requesterId === meId ? row.addressee : row.requester,
			})),
			total,
		};
	}

	async getReceivedRequests(meId: string, query: SearchPageDto): Promise<Paged<unknown>> {
		const where: Prisma.FriendshipWhereInput = {
			status: 'PENDING',
			addresseeId: meId,
			requester: this.usernameLike(query.search),
		};
		const [rows, total] = await this.prisma.$transaction([
			this.prisma.friendship.findMany({
				where,
				select: { id: true, createdAt: true, requester: { select: PUBLIC_USER_SELECT } },
				orderBy: { createdAt: 'desc' },
				...pageArgs(query),
			}),
			this.prisma.friendship.count({ where }),
		]);

		return {
			items: rows.map((r) => ({ requestId: r.id, createdAt: r.createdAt, user: r.requester })),
			total,
		};
	}

	async getSentRequests(meId: string, query: SearchPageDto): Promise<Paged<unknown>> {
		const where: Prisma.FriendshipWhereInput = {
			status: 'PENDING',
			requesterId: meId,
			addressee: this.usernameLike(query.search),
		};
		const [rows, total] = await this.prisma.$transaction([
			this.prisma.friendship.findMany({
				where,
				select: { id: true, createdAt: true, addressee: { select: PUBLIC_USER_SELECT } },
				orderBy: { createdAt: 'desc' },
				...pageArgs(query),
			}),
			this.prisma.friendship.count({ where }),
		]);

		return {
			items: rows.map((r) => ({ requestId: r.id, createdAt: r.createdAt, user: r.addressee })),
			total,
		};
	}

	/** The numbers shown on the tabs and the navigation badge. */
	async summary(meId: string) {
		const [friends, received, sent, unreadMessages] = await this.prisma.$transaction([
			this.prisma.friendship.count({
				where: { status: 'ACCEPTED', OR: [{ requesterId: meId }, { addresseeId: meId }] },
			}),
			this.prisma.friendship.count({ where: { status: 'PENDING', addresseeId: meId } }),
			this.prisma.friendship.count({ where: { status: 'PENDING', requesterId: meId } }),
			this.prisma.directMessage.count({ where: { receiverId: meId, readAt: null } }),
		]);

		return { friends, received, sent, unreadMessages };
	}

	async cancelRequest(meId: string, requestId: string) {
		const request = await this.prisma.friendship.findFirst({
			where: { id: requestId, requesterId: meId, status: 'PENDING' },
			select: { addresseeId: true },
		});
		const { count } = await this.prisma.friendship.deleteMany({
			where: { id: requestId, requesterId: meId, status: 'PENDING' },
		});

		if (!request || count === 0) {
			throw new NotFoundException('Friend request not found');
		}
		this.notify(request.addresseeId);
	}

	async removeFriend(meId: string, friendshipId: string) {
		const friendship = await this.prisma.friendship.findFirst({
			where: {
				id: friendshipId,
				status: 'ACCEPTED',
				OR: [{ requesterId: meId }, { addresseeId: meId }],
			},
			select: { requesterId: true, addresseeId: true },
		});
		const { count } = await this.prisma.friendship.deleteMany({
			where: {
				id: friendshipId,
				status: 'ACCEPTED',
				OR: [{ requesterId: meId }, { addresseeId: meId }],
			},
		});

		if (!friendship || count === 0) {
			throw new NotFoundException('Friendship not found');
		}
		this.notify(friendship.requesterId === meId ? friendship.addresseeId : friendship.requesterId);
	}
}
