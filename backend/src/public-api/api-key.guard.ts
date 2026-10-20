import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashApiKey } from '../api-keys/api-keys.service';

export type ApiKeyPrincipal = { id: string; userId: string };

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers['x-api-key'];
    if (typeof header !== 'string' || !header.startsWith('sr_live_')) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    const apiKey = await this.prisma.apiKey.findUnique({
      where: { keyHash: hashApiKey(header) },
      select: { id: true, userId: true, revokedAt: true, expiresAt: true },
    });
    if (
      !apiKey ||
      apiKey.revokedAt ||
      (apiKey.expiresAt && apiKey.expiresAt <= new Date())
    ) {
      throw new UnauthorizedException('Invalid or expired API key');
    }

    request.apiKey = {
      id: apiKey.id,
      userId: apiKey.userId,
    } satisfies ApiKeyPrincipal;
    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });
    return true;
  }
}
