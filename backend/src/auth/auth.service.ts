import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { randomUUID, randomBytes, createHash } from 'crypto';

/** The browser gets the raw token; the database only ever sees this digest. */
function hashToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

export interface IssuedSession {
	accessToken: string;
	refreshToken: string;
	refreshExpiresAt: Date;
}

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private config: ConfigService,
	) { }

	private refreshTtlMs(): number {
		const days = parseInt(this.config.get<string>('REFRESH_EXPIRES_IN_DAYS') ?? '30', 10);
		return days * 24 * 60 * 60 * 1000;
	}

	/**
	 * A short-lived JWT for the API, plus an opaque refresh token stored hashed.
	 * The refresh token is opaque rather than a JWT so it can be revoked without
	 * carrying a blacklist of signed payloads.
	 */
	private async issueSession(userId: string, email: string): Promise<IssuedSession> {
		const accessToken = await this.jwtService.signAsync({
			sub: userId,
			email,
			jti: randomUUID(),
		});

		const refreshToken = randomBytes(48).toString('base64url');
		const refreshExpiresAt = new Date(Date.now() + this.refreshTtlMs());

		await this.prisma.refreshToken.create({
			data: {
				tokenHash: hashToken(refreshToken),
				userId,
				expiresAt: refreshExpiresAt,
			},
		});

		return { accessToken, refreshToken, refreshExpiresAt };
	}

	async register(dto: RegisterDto) {
		const existing = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});
		if (existing) {
			throw new ConflictException('Email already in use');
		}

		const passwordHash = await bcrypt.hash(dto.password, 10);

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				username: dto.username,
				passwordHash,
			},
		});

		const { passwordHash: _, ...safeUser } = user;
		return safeUser;
	}

	async login(dto: LoginDto): Promise<IssuedSession> {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
		if (!passwordMatches) {
			throw new UnauthorizedException('Invalid credentials');
		}

		return this.issueSession(user.id, user.email);
	}

	/**
	 * Exchanges a refresh token for a new pair, rotating as it goes.
	 *
	 * A token that has already been rotated must never work twice: seeing one
	 * means the cookie leaked, so every refresh token the user holds is revoked
	 * and they have to sign in again.
	 */
	async refresh(token: string | undefined): Promise<IssuedSession> {
		if (!token) {
			throw new UnauthorizedException('No refresh token');
		}

		const stored = await this.prisma.refreshToken.findUnique({
			where: { tokenHash: hashToken(token) },
			include: { user: true },
		});

		if (!stored) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		if (stored.revokedAt) {
			await this.prisma.refreshToken.updateMany({
				where: { userId: stored.userId, revokedAt: null },
				data: { revokedAt: new Date() },
			});
			throw new UnauthorizedException('Refresh token reuse detected');
		}

		if (stored.expiresAt.getTime() <= Date.now()) {
			throw new UnauthorizedException('Refresh token expired');
		}

		await this.prisma.refreshToken.update({
			where: { id: stored.id },
			data: { revokedAt: new Date() },
		});

		return this.issueSession(stored.user.id, stored.user.email);
	}

	/** Revokes the access token's jti and the refresh token behind it. */
	async logout(accessToken: string | undefined, refreshToken: string | undefined) {
		if (accessToken) {
			try {
				const payload = await this.jwtService.verifyAsync(accessToken);
				await this.prisma.revokedToken.upsert({
					where: { jti: payload.jti },
					update: {},
					create: {
						jti: payload.jti,
						expiresAt: new Date(payload.exp * 1000),
					},
				});
			} catch {
				// An already-expired access token needs no revoking.
			}
		}

		if (refreshToken) {
			await this.prisma.refreshToken.updateMany({
				where: { tokenHash: hashToken(refreshToken), revokedAt: null },
				data: { revokedAt: new Date() },
			});
		}

		return { message: 'Logged out successfully' };
	}
}
