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
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@ApiTags('API keys')
@ApiBearerAuth()
@Controller('keys')
export class ApiKeysController {
  constructor(private apiKeys: ApiKeysService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an API key; its secret is returned only once',
  })
  create(@Req() req: any, @Body() dto: CreateApiKeyDto) {
    return this.apiKeys.create(req.user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List API keys without exposing their secrets' })
  list(@Req() req: any) {
    return this.apiKeys.list(req.user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke an API key' })
  async revoke(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    await this.apiKeys.revoke(req.user.sub, id);
  }
}
