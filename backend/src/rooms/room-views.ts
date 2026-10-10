import { Prisma } from '../generated/prisma/client';

/** A room with no activity for this long counts as archived. */
export const ACTIVE_DAYS = 7;

export const activeSince = () =>
	new Date(Date.now() - ACTIVE_DAYS * 24 * 60 * 60 * 1000);

/** Public rooms, plus the private ones the caller belongs to. */
export const visibleTo = (meId: string): Prisma.RoomWhereInput => ({
	OR: [{ visibility: 'PUBLIC' }, { members: { some: { userId: meId } } }],
});

export const roomSelect = (meId: string) =>
	({
		id: true,
		name: true,
		subject: true,
		visibility: true,
		inviteCode: true,
		ownerId: true,
		createdAt: true,
		lastActiveAt: true,
		owner: { select: { username: true } },
		_count: { select: { members: true } },
		// At most one row: whether the caller is in the room.
		members: { where: { userId: meId }, select: { userId: true } },
	}) satisfies Prisma.RoomSelect;

type RoomRow = Prisma.RoomGetPayload<{ select: ReturnType<typeof roomSelect> }>;

export function toRoomView(row: RoomRow) {
	const isMember = row.members.length > 0;
	return {
		id: row.id,
		name: row.name,
		subject: row.subject,
		visibility: row.visibility,
		// Only people inside can share it on; outsiders see public rooms by id.
		inviteCode: isMember ? row.inviteCode : null,
		status: row.lastActiveAt >= activeSince() ? 'active' : 'archived',
		participantCount: row._count.members,
		ownerId: row.ownerId,
		ownerUsername: row.owner.username,
		lastActiveAt: row.lastActiveAt,
		createdAt: row.createdAt,
		isMember,
	};
}

export const fileSelect = {
	id: true,
	name: true,
	url: true,
	size: true,
	mimeType: true,
	createdAt: true,
	uploader: { select: { id: true, username: true } },
} as const;
