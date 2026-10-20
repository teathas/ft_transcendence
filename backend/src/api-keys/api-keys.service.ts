import { randomBytes, createHash } from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

export const hashApiKey = (key: string) =>
  createHash('sha256').update(key).digest('hex');

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateApiKeyDto) {
    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    if (expiresAt && expiresAt <= new Date()) {
      throw new BadRequestException('Expiration date must be in the future');
    }

    const key = `sr_live_${randomBytes(32).toString('base64url')}`;
    const prefix = key.slice(0, 16);
    const created = await this.prisma.apiKey.create({
      data: {
        name: dto.name.trim(),
        prefix,
        keyHash: hashApiKey(key),
        userId,
        expiresAt,
      },
      select: {
        id: true,
        name: true,
        prefix: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    // The plaintext credential is deliberately returned exactly once.
    return { ...created, key };
  }

  list(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        prefix: true,
        createdAt: true,
        lastUsedAt: true,
        expiresAt: true,
        revokedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revoke(userId: string, id: string) {
    const result = await this.prisma.apiKey.updateMany({
      where: { id, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (result.count === 0) throw new NotFoundException('API key not found');
  }
}
