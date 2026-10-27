
import { FindRoomsQueryDto } from './dto/find-rooms-query.dto';

import { Controller, Post, Patch,Body, Req, UseGuards, Param, Delete, Get, Query, ParseUUIDPipe, UploadedFile, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { RoomsService } from './rooms.service';
import { CreateRoomDto  } from './dto/create-room.dto';
import { JoinRoomDto  } from './dto/join-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ListRoomsDto } from './dto/list-rooms.dto';
import { JoinByCodeDto } from './dto/join-by-code.dto';
import { RoomQueriesService } from './room-queries.service';
import { RoomFilesService, MAX_FILE_SIZE } from './room-files.service';

@Controller('rooms')
export class RoomsController {
    constructor(
        private roomsService: RoomsService,
        private queries: RoomQueriesService,
        private files: RoomFilesService,
    ) { }

    // Fixed paths first: `:roomId` would swallow them.
    @Get()
    async list(@Query() query: ListRoomsDto, @Req() req: any)
    {
        return this.queries.list(req.user.sub, query);
    }
    @Get('stats')
    async stats(@Req() req: any)
    {
        return this.queries.stats(req.user.sub);
    }
    @Post('join')
    async joinByCode(@Body() dto: JoinByCodeDto, @Req() req: any)
    {
        return this.queries.joinByCode(req.user.sub, dto);
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() dto:CreateRoomDto,@Req() req: any)
    {
        const ownerId = req.user.sub;
        return this.roomsService.create(dto, ownerId);
    }
    @Post(':roomId/join')
    async join(@Param('roomId') roomId: string,@Body() dto:JoinRoomDto,@Req() req: any)
    {
        const userId = req.user.sub;
        return this.roomsService.join(roomId, userId,dto);
    }

    @Get('public')
    async findPublicRooms(@Query() query: FindRoomsQueryDto) {
    return this.roomsService.findPublicRooms(query);
    }

    @Delete(':roomId/leave')
    async leave(@Param('roomId') roomId: string,@Req() req: any)
    {
        const userId = req.user.sub;
        return this.roomsService.leave(roomId, userId);
    }

    // Everything below is one room, opened by id.
    @Get(':roomId')
    async detail(@Param('roomId', ParseUUIDPipe) roomId: string, @Req() req: any)
    {
        return this.queries.detail(req.user.sub, roomId);
    }
    @Get(':roomId/files')
    async listFiles(@Param('roomId', ParseUUIDPipe) roomId: string, @Req() req: any)
    {
        return this.files.list(roomId, req.user.sub);
    }
    @Get('shared/:friendId')
    async getSharedRooms(@Param('friendId', ParseUUIDPipe) friendId: string, @Req() req: any)
    {
        return this.roomsService.getSharedRooms(friendId, req.user.sub);
    }
    @Post(':roomId/files')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: MAX_FILE_SIZE } }))
    async uploadFile(@Param('roomId', ParseUUIDPipe) roomId: string, @UploadedFile() file: Express.Multer.File, @Req() req: any)
    {
        return this.files.upload(roomId, req.user.sub, file);
    }
    @Delete(':roomId/files/:fileId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeFile(@Param('roomId', ParseUUIDPipe) roomId: string, @Param('fileId', ParseUUIDPipe) fileId: string, @Req() req: any)
    {
        await this.files.remove(roomId, fileId, req.user.sub);
    }

}
