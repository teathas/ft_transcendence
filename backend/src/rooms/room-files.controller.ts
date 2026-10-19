import { Controller, Get, Param, ParseUUIDPipe, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { RoomFilesService } from './room-files.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('uploads/rooms')
export class RoomFilesController {
	constructor(private files: RoomFilesService) {}

	@Public()
	@Get(':roomId/:filename')
	async download(
		@Param('roomId', ParseUUIDPipe) roomId: string,
		@Param('filename') filename: string,
		@Query('token') token: string | undefined,
		@Res() res: Response,
	) {
		const path = await this.files.resolveDownload(roomId, filename, token);
		res.setHeader('X-Content-Type-Options', 'nosniff');
		res.setHeader('Content-Disposition', 'attachment');
		res.sendFile(path, (err) => {
			if (err && !res.headersSent) res.status(404).end();
		});
	}
}