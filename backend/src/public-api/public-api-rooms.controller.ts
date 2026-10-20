import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator';
import { ApiKeyGuard } from './api-key.guard';
import { ApiKeyThrottlerGuard } from './api-key-throttler.guard';
import { CurrentApiUser } from './current-api-user.decorator';
import { ApiRoomDto } from './dto/api-room.dto';
import { ListApiRoomsDto } from './dto/list-api-rooms.dto';
import { PublicApiRoomsService } from './public-api-rooms.service';

@Public()
@ApiTags('Public API - Rooms')
@ApiSecurity('api-key')
@ApiUnauthorizedResponse({
  description: 'Missing, invalid, expired or revoked API key',
})
@ApiTooManyRequestsResponse({ description: 'API key rate limit exceeded' })
@UseGuards(ApiKeyGuard, ApiKeyThrottlerGuard)
@Controller('api/v1/rooms')
export class PublicApiRoomsController {
  constructor(private rooms: PublicApiRoomsService) {}

  @Get()
  @ApiOperation({ summary: 'Search rooms the API key user participates in' })
  @ApiOkResponse({ description: 'A paginated room list' })
  list(@CurrentApiUser() userId: string, @Query() query: ListApiRoomsDto) {
    return this.rooms.list(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one room the API key user participates in' })
  @ApiOkResponse({ description: 'The requested room' })
  @ApiNotFoundResponse({
    description: 'Room not found or not joined by this user',
  })
  get(
    @CurrentApiUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.rooms.get(userId, id);
  }

  @Post()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @ApiOperation({ summary: 'Create a room' })
  @ApiCreatedResponse({ description: 'The created room' })
  create(@CurrentApiUser() userId: string, @Body() dto: ApiRoomDto) {
    return this.rooms.create(userId, dto);
  }

  @Put(':id')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @ApiOperation({ summary: 'Replace an owned room' })
  @ApiOkResponse({ description: 'The updated room' })
  @ApiNotFoundResponse({
    description: 'Room not found or not owned by this user',
  })
  replace(
    @CurrentApiUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApiRoomDto,
  ) {
    return this.rooms.replace(userId, id, dto);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an owned room and its content' })
  @ApiNoContentResponse({ description: 'Room deleted' })
  @ApiNotFoundResponse({
    description: 'Room not found or not owned by this user',
  })
  async remove(
    @CurrentApiUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.rooms.remove(userId, id);
  }
}
