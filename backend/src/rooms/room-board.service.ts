import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { assertMember } from './room-access';
import { SaveBoardDto } from './dto/save-board.dto';

const BOARD_SELECT = { boardSnapshot: true, boardVersion: true, boardUpdatedAt: true } as const;

const toView = (room: { boardSnapshot: Prisma.JsonValue; boardVersion: number; boardUpdatedAt: Date | null }) => ({
	snapshot: room.boardSnapshot,
	version: room.boardVersion,
	updatedAt: room.boardUpdatedAt,
});

/**
 * The whiteboard document. Provisional: one snapshot per room, saved whole.
 * `baseVersion` is the only guard against two people overwriting each other.
 */
@Injectable()
export class RoomBoardService {
	constructor(private prisma: PrismaService) {}

	async get(roomId: string, userId: string) {
		await assertMember(this.prisma, roomId, userId);
		return toView(await this.prisma.room.findUniqueOrThrow({ where: { id: roomId }, select: BOARD_SELECT }));
	}

	async save(roomId: string, userId: string, dto: SaveBoardDto) {
		await assertMember(this.prisma, roomId, userId);

		const now = new Date();
		// The version check and the write are one statement, so two saves from
		// the same version cannot both succeed.
		const { count } = await this.prisma.room.updateMany({
			where: { id: roomId, boardVersion: dto.baseVersion },
			data: {
				boardSnapshot: dto.snapshot as Prisma.InputJsonValue,
				boardVersion: { increment: 1 },
				boardUpdatedAt: now,
				lastActiveAt: now,
			},
		});

		const current = await this.prisma.room.findUniqueOrThrow({ where: { id: roomId }, select: BOARD_SELECT });
		if (count === 0) {
			throw new ConflictException({
				message: 'The board changed since you loaded it',
				currentVersion: current.boardVersion,
			});
		}
		return { version: current.boardVersion, updatedAt: current.boardUpdatedAt };
	}
}
