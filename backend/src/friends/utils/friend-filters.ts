import { Prisma } from '../../generated/prisma/client';

export const RELATIONSHIPS = ['all', 'none', 'friends', 'sent', 'received'] as const;
export type RelationshipFilter = (typeof RELATIONSHIPS)[number];

/**
 * Users who are friends with `meId`. A friendship is one row, with either of
 * the two people as requester, so both directions have to be matched.
 */
export function friendsOf(meId: string): Prisma.UserWhereInput {
	return {
		OR: [
			{ sentFriendRequests: { some: { addresseeId: meId, status: 'ACCEPTED' } } },
			{ receivedFriendRequests: { some: { requesterId: meId, status: 'ACCEPTED' } } },
		],
	};
}

/** Narrows a list of users to one relationship with `meId`. */
export function relationshipFilter(
	meId: string,
	relationship: RelationshipFilter = 'all',
): Prisma.UserWhereInput {
	switch (relationship) {
		case 'friends':
			return friendsOf(meId);
		// I asked them, they have not answered.
		case 'sent':
			return { receivedFriendRequests: { some: { requesterId: meId, status: 'PENDING' } } };
		// They asked me.
		case 'received':
			return { sentFriendRequests: { some: { addresseeId: meId, status: 'PENDING' } } };
		// No friendship row at all, in either direction.
		case 'none':
			return {
				NOT: {
					OR: [
						{ sentFriendRequests: { some: { addresseeId: meId } } },
						{ receivedFriendRequests: { some: { requesterId: meId } } },
					],
				},
			};
		default:
			return {};
	}
}
