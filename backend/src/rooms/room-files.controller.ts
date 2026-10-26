import { Controller, Get, Param, ParseUUIDPipe, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { RoomFilesService } from './room-files.service';
import { Public } from '../auth/decorators/public.decorator';
import { extractBearerToken } from '../auth/utils/extract-token.uitl';

@Controller('uploads/rooms')
export class RoomFilesController {
	constructor(private files: RoomFilesService) {}

	@Public()
	@Get(':roomId/:filename')
	async download(
		@Param('roomId', ParseUUIDPipe) roomId: string,
		@Param('filename') filename: string,
		@Query('token') token: string | undefined,
    @Query('preview') preview: string | undefined,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const file = await this.files.resolveDownload(roomId, filename, extractBearerToken(req) ?? token);
    const inline =
      preview === '1' &&
      (file.mimeType === 'application/pdf' ||
        file.mimeType.startsWith('image/'));

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(file.name)}`,
    );
    res.sendFile(file.path, (error) => {
      if (error && !res.headersSent) res.status(404).end();
    });
	}
}

