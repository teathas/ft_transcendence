import { PUBLIC_USER_SELECT } from '../users/users.service';

/** What a room message looks like on the wire: the message and who wrote it. */
export const MESSAGE_SELECT = {
	id: true,
	content: true,
	userId: true,
	roomId: true,
	createdAt: true,
	user: { select: PUBLIC_USER_SELECT },
} as const;

type Row = {
	id: string;
	content: string;
	userId: string;
	roomId: string;
	createdAt: Date;
	user: { id: string; username: string; avatarUrl: string | null };
};

export function toMessageView(row: Row) {
	const { user, ...message } = row;
	return {
		...message,
		author: { id: user.id, username: user.username, avatarUrl: user.avatarUrl },
	};
}

export const MESSAGES_PAGE = 30;
