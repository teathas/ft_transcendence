import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { basename, extname, join } from 'path';
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertMember } from './room-access';
import { fileSelect } from './room-views';
import { RealtimeService } from '../realtime/realtime.service';

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
	constructor(private prisma: PrismaService, private realtime: RealtimeService) {}

	async list(roomId: string, userId: string) {
		await assertMember(this.prisma, roomId, userId);
		return this.prisma.roomFile.findMany({
			where: { roomId },
			select: fileSelect,
			orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
			take: 200,
		});
	}

	/** Any type, up to 10 MB. The answer carries the `url` the file is served at. */
	async upload(roomId: string, userId: string, file: Express.Multer.File | undefined) {
		await assertMember(this.prisma, roomId, userId);
		if (!file) throw new BadRequestException('A file is required');
		if (file.size > MAX_FILE_SIZE) throw new BadRequestException('The file is larger than 10 MB');

		const name = basename(decodeName(file.originalname)).slice(0, 200) || 'file';
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
			select: { id: true, uploaderId: true, url: true },
		});
		if (!file) throw new NotFoundException('File not found');
		if (file.uploaderId !== userId && ownerId !== userId) {
			throw new ForbiddenException('Only the uploader or the room owner can delete a file');
		}

		await this.prisma.roomFile.delete({ where: { id: file.id } });
		await unlink(join(uploadRoot(), 'rooms', roomId, basename(file.url))).catch(() => undefined);
		this.realtime.emitToRoom(roomId, 'room:file-removed', { roomId, fileId: file.id });
	}
}
