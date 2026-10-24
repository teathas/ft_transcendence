import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { basename, extname, join } from 'path';
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertMember } from './room-access';
import { fileSelect } from './room-views';
import { RealtimeService } from '../realtime/realtime.service';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../notifications/notifications.service';

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES: Record<string, readonly string[]> = {
	'.pdf': ['application/pdf'],
	'.png': ['image/png'],
	'.jpg': ['image/jpeg'],
	'.jpeg': ['image/jpeg'],
	'.webp': ['image/webp'],
	'.txt': ['text/plain'],
	'.doc': ['application/msword'],
	'.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
	'.xls': ['application/vnd.ms-excel'],
	'.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
	'.ppt': ['application/vnd.ms-powerpoint'],
	'.pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
};

const uploadRoot = () => process.env.UPLOAD_DIR ?? join(process.cwd(), 'uploads');

/** multer reads names as latin1; browsers send UTF-8, so "é" arrives as "Ã©". */
const decodeName = (name: string) => Buffer.from(name, 'latin1').toString('utf8');

/** A short plain extension is kept so the file still opens by double click. */
const safeExtension = (name: string) => {
	const ext = extname(name).toLowerCase();
	return /^\.[a-z0-9]{1,10}$/.test(ext) ? ext : '';
};

@Injectable()
export class RoomFilesService {
	constructor(private prisma: PrismaService, private realtime: RealtimeService, private auth: AuthService, private notifications: NotificationsService) {}

	private async notifyMembers(roomId: string, actorId: string, type: 'ROOM_FILE_UPLOADED' | 'ROOM_FILE_DELETED', data: Record<string, string>) {
		const members = await this.prisma.roomMember.findMany({
			where: { roomId, userId: { not: actorId } },
			select: { userId: true },
		});
		await Promise.all(members.map(({ userId }) => this.notifications.createNotification({
			recipientId: userId,
			actorId,
			type,
			category: 'ROOM',
			data: { roomId, ...data },
		})));
	}

	async list(roomId: string, userId: string) {
		await assertMember(this.prisma, roomId, userId);
		return this.prisma.roomFile.findMany({
			where: { roomId },
			select: fileSelect,
			orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
			take: 200,
		});
	}

	/** A supported document or image, up to 10 MB. */
	async upload(roomId: string, userId: string, file: Express.Multer.File | undefined) {
		await assertMember(this.prisma, roomId, userId);
		if (!file) throw new BadRequestException('A file is required');
		if (file.size > MAX_FILE_SIZE) throw new BadRequestException('The file is larger than 10 MB');

		const name = basename(decodeName(file.originalname)).slice(0, 200) || 'file';
		const extension = extname(name).toLowerCase();
		if (!ALLOWED_FILE_TYPES[extension]?.includes(file.mimetype)) {
			throw new BadRequestException('This file type is not allowed');
		}
		const filename = `${randomUUID()}${safeExtension(name)}`;
		const dir = join(uploadRoot(), 'rooms', roomId);
		await mkdir(dir, { recursive: true });
		await writeFile(join(dir, filename), file.buffer);

		try {
			const [created] = await this.prisma.$transaction([
				this.prisma.roomFile.create({
					data: {
						roomId,
						uploaderId: userId,
						name,
						url: `/uploads/rooms/${roomId}/${filename}`,
						size: file.size,
						mimeType: file.mimetype || 'application/octet-stream',
					},
					select: fileSelect,
				}),
				this.prisma.room.update({ where: { id: roomId }, data: { lastActiveAt: new Date() } }),
			]);
			this.realtime.emitToRoom(roomId, 'room:file-added', { roomId, file: created });
			await this.notifyMembers(roomId, userId, 'ROOM_FILE_UPLOADED', { fileId: created.id, fileName: created.name });
			return created;
		} catch (error) {
			// No row, so nothing would ever point at the bytes.
			await unlink(join(dir, filename)).catch(() => undefined);
			throw error;
		}
	}

	/** The uploader or the room's owner can remove a file. */
	async remove(roomId: string, fileId: string, userId: string) {
		const { ownerId } = await assertMember(this.prisma, roomId, userId);

		const file = await this.prisma.roomFile.findFirst({
			where: { id: fileId, roomId },
			select: { id: true, uploaderId: true, url: true, name: true },
		});
		if (!file) throw new NotFoundException('File not found');
		if (file.uploaderId !== userId && ownerId !== userId) {
			throw new ForbiddenException('Only the uploader or the room owner can delete a file');
		}

		await this.prisma.roomFile.delete({ where: { id: file.id } });
		await unlink(join(uploadRoot(), 'rooms', roomId, basename(file.url))).catch(() => undefined);
		this.realtime.emitToRoom(roomId, 'room:file-removed', { roomId, fileId: file.id });
		await this.notifyMembers(roomId, userId, 'ROOM_FILE_DELETED', { fileId: file.id, fileName: file.name });
	}

	/** Validates the query token and room membership before exposing bytes. */
	async resolveDownload(roomId: string, filename: string, token: string | undefined) {
		if (!token) throw new UnauthorizedException('No token provided');
		const { sub } = await this.auth.verifyAccessToken(token);
		await assertMember(this.prisma, roomId, sub);

		const safe = basename(filename);
		const file = await this.prisma.roomFile.findFirst({
			where: { roomId, url: `/uploads/rooms/${roomId}/${safe}` },
			select: { name: true, mimeType: true },
		});
		if (!file) throw new NotFoundException('File not found');

		return {
			path: join(uploadRoot(), 'rooms', roomId, safe),
			name: file.name,
			mimeType: file.mimeType,
		};
	}
}
