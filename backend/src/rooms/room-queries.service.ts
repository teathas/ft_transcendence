import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { Paged, pageArgs } from '../common/dto/page.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MESSAGE_SELECT, MESSAGES_PAGE, toMessageView } from '../messages/message-view';
import { PUBLIC_USER_SELECT } from '../users/users.service';
import { ListRoomsDto } from './dto/list-rooms.dto';
import { JoinByCodeDto } from './dto/join-by-code.dto';
import { activeSince, fileSelect, roomSelect, toRoomView, visibleTo } from './room-views';

@Injectable()
export class RoomQueriesService {
	constructor(private prisma: PrismaService) {}

	/** The rooms the caller can see, filtered, sorted and paged by the API. */
	async list(meId: string, query: ListRoomsDto): Promise<Paged<ReturnType<typeof toRoomView>>> {
		const filters: Prisma.RoomWhereInput[] = [visibleTo(meId)];

		if (query.search) {
			filters.push({
				OR: [
					{ name: { contains: query.search, mode: 'insensitive' } },
					{ subject: { contains: query.search, mode: 'insensitive' } },
				],
			});
		}
		if (query.subject && query.subject !== 'all') {
			filters.push({ subject: { equals: query.subject, mode: 'insensitive' } });
		}
		if (query.status === 'active') filters.push({ lastActiveAt: { gte: activeSince() } });
		if (query.status === 'archived') filters.push({ lastActiveAt: { lt: activeSince() } });
		if (query.ownership === 'mine') filters.push({ members: { some: { userId: meId } } });
		if (query.ownership === 'owned') filters.push({ ownerId: meId });
		if (query.ownership === 'joined') {
			filters.push({ ownerId: { not: meId }, members: { some: { userId: meId } } });
		}
		const where: Prisma.RoomWhereInput = { AND: filters };

		const orderBy: Prisma.RoomOrderByWithRelationInput[] =
			query.sort === 'name'
				? [{ name: 'asc' }, { id: 'asc' }]
				: query.sort === 'participants'
					? [{ members: { _count: 'desc' } }, { lastActiveAt: 'desc' }, { id: 'asc' }]
					: [{ lastActiveAt: 'desc' }, { id: 'asc' }];

		const [rows, total] = await Promise.all([
			this.prisma.room.findMany({
				where,
				select: roomSelect(meId),
				orderBy,
				...pageArgs(query),
			}),
			this.prisma.room.count({ where }),
		]);

		return { items: rows.map(toRoomView), total };
	}

	/** The numbers above the list, over every room the caller can see. */
	async stats(meId: string) {
		const visible = visibleTo(meId);
		const [total, active, owned, online] = await Promise.all([
			this.prisma.room.count({ where: visible }),
			this.prisma.room.count({ where: { AND: [visible, { lastActiveAt: { gte: activeSince() } }] } }),
			this.prisma.room.count({ where: { AND: [visible, { ownerId: meId }] } }),
			// People online in the rooms the caller is in, each counted once.
			this.prisma.user.count({
				where: {
					status: 'ONLINE',
					roomMemberships: { some: { room: { members: { some: { userId: meId } } } } },
				},
			}),
		]);
		return { total, active, owned, participants: online };
	}

	/** Joins by invite code: the only way into a private room. */
	async joinByCode(meId: string, dto: JoinByCodeDto) {
		const room = await this.prisma.room.findUnique({
			where: { inviteCode: dto.inviteCode },
			select: { id: true },
		});
		if (!room) throw new NotFoundException('No room has this code');

		await this.prisma.roomMember.upsert({
			where: { userId_roomId: { userId: meId, roomId: room.id } },
			update: {},
			create: { userId: meId, roomId: room.id },
		});
		return this.view(meId, room.id);
	}

	private async view(meId: string, roomId: string) {
		const row = await this.prisma.room.findUnique({
			where: { id: roomId },
			select: roomSelect(meId),
		});
		if (!row) throw new NotFoundException('Room not found');
		return toRoomView(row);
	}

	/**
	 * Everything a room needs to open, in one call: the room, who is in it and
	 * whether they are online, the latest messages and the files. The board is
	 * not here: it arrives over its own live connection (see board-sync).
	 */
	async detail(meId: string, roomId: string) {
		const room = await this.view(meId, roomId);
		if (!room.isMember) {
			throw new ForbiddenException('Join the room to open it');
		}

		const [members, messages, files] = await Promise.all([
			this.prisma.roomMember.findMany({
				where: { roomId },
				select: { joinedAt: true, user: { select: PUBLIC_USER_SELECT } },
				orderBy: [{ joinedAt: 'asc' }, { userId: 'asc' }],
				take: 200,
			}),
			this.prisma.message.findMany({
				where: { roomId },
				select: MESSAGE_SELECT,
				orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
				take: MESSAGES_PAGE + 1,
			}),
			this.prisma.roomFile.findMany({
				where: { roomId },
				select: fileSelect,
				orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
				take: 200,
			}),
		]);

		const page = messages.slice(0, MESSAGES_PAGE);
		return {
			room,
			members: members.map(({ joinedAt, user }) => ({
				id: user.id,
				username: user.username,
				avatarUrl: user.avatarUrl,
				status: user.status,
				role: user.id === room.ownerId ? 'host' : 'guest',
				joinedAt,
			})),
			messages: {
				items: page.map(toMessageView),
				nextCursor: messages.length > MESSAGES_PAGE ? page[page.length - 1].id : null,
			},
			files,
		};
	}
}
