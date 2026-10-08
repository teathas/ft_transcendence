import { PrismaClientKnownRequestError } from '@prisma/client-runtime-utils';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toFriendPair } from './utils/friend-pair';
import { Prisma } from '../generated/prisma/client';
import { PUBLIC_USER_SELECT } from '../users/users.service';

@Injectable()
export class FriendsService {
	constructor(private prisma: PrismaService) {}

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
			return await this.prisma.friendship.create({
				data: { requesterId: meId, addresseeId, lowId, highId },
				select: { id: true, status: true, addresseeId: true, createdAt: true },
			});
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
		const result = await this.prisma.friendship.updateMany({
			where: { id, addresseeId: meId, status: 'PENDING' },
			data: { status: 'ACCEPTED' },
		});
		if (result.count === 0) {
			throw new NotFoundException('Friend request not found');
		}
		return { id, status: 'ACCEPTED' };
	}

	async rejectRequest(meId: string, id: string) {
		const result = await this.prisma.friendship.deleteMany({
			where: { id, addresseeId: meId, status: 'PENDING' },
		});
		if (result.count === 0) {
			throw new NotFoundException('Friend request not found');
		}
	}

	async getFriends(meId: string) {
		const rows = await this.prisma.friendship.findMany({
			where: {
				status: 'ACCEPTED',
				OR: [{ requesterId: meId }, { addresseeId: meId }],
			},
			select: {
				id: true,
				requesterId: true,
				requester: { select: PUBLIC_USER_SELECT },
				addressee: { select: PUBLIC_USER_SELECT },
			},
			orderBy: { createdAt: 'desc' },
		});

		return rows.map((f) => ({
			friendshipId: f.id,
			user: f.requesterId == meId ? f.addressee : f.requester,
		}));
	}

	async getReceivedRequests(meId: string) {
		const rows = await this.prisma.friendship.findMany({
			where: { status: 'PENDING', addresseeId: meId },
			select: { id: true, createdAt: true, requester: { select: PUBLIC_USER_SELECT }},
			orderBy: { createdAt: 'desc' },
		});

		return rows.map((r) => ({ requestId: r.id, createdAt: r.createdAt, user: r.requester }));
	}

	async getSentRequests(meId: string) {
		const rows = await this.prisma.friendship.findMany({
			where: { status: 'PENDING', requesterId: meId },
			select: { id: true, createdAt: true, addressee: { select: PUBLIC_USER_SELECT }},
			orderBy: { createdAt: 'desc' },
		});

		return rows.map((r) => ({ requestId: r.id, createdAt: r.createdAt, user: r.addressee }));
	}

	async cancelRequest(meId: string, requestId: string) {
		const { count } = await this.prisma.friendship.deleteMany({
			where: { id: requestId, requesterId: meId, status: 'PENDING' },
		});

		if (count === 0) {
			throw new NotFoundException('Friend request not found');
		}
	}

	async removeFriend(meId: string, friendshipId: string) {
		const { count } = await this.prisma.friendship.deleteMany({
			where: {
				id: friendshipId,
				status: 'ACCEPTED',
				OR: [{ requesterId: meId }, { addresseeId: meId }],
			},
		});

		if (count === 0) {
			throw new NotFoundException('Friendship not found');
		}
	}
}
