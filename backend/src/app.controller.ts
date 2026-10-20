import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
	private readonly appService: AppService,
	private readonly prisma: PrismaService,
 ) {}

 @Public()
 @Get()
  root() {
    return { status: 'ok' };
  }

 @Public()
 @Get('health')
 async health() {
	try {
		await this.prisma.$queryRaw`SELECT 1`;
	} catch {
		throw new ServiceUnavailableException({ status: 'error', database: 'down' });
	}
	return { status: 'ok', database: 'up' };
 }
}
