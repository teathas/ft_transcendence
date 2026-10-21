import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '../generated/prisma/client';

export type JwtPayload = { sub: string; email: string; jti: string; exp: number };

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private config: ConfigService,
	) { }

	private refreshTokenLifetimeSeconds() {
		return parseInt(this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN') ?? '604800', 10);
	}

	private hashRefreshToken(token: string) {
		return createHash('sha256').update(token).digest('hex');
	}

	private async issueAccessToken(user: { id: string; email: string }) {
		return this.jwtService.signAsync({ sub: user.id, email: user.email, jti: randomUUID() });
	}

	private async createRefreshSession(userId: string) {
		const refreshToken = randomBytes(48).toString('base64url');
		const expiresAt = new Date(Date.now() + this.refreshTokenLifetimeSeconds() * 1000);

		await this.prisma.refreshSession.create({
			data: {
				tokenHash: this.hashRefreshToken(refreshToken),
				userId,
				expiresAt,
			},
		});

		return refreshToken;
	}

	async register(dto: RegisterDto) {
		const existingEmail = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});
		if (existingEmail) {
			throw new ConflictException('Email already in use');
		}

		const existingUsername = await this.prisma.user.findUnique({
			where: { username: dto.username },
		});
		if (existingUsername) {
			throw new ConflictException('Username already in use');
		}

		const passwordHash = await bcrypt.hash(dto.password, 10);

		let user;
		try {
			user = await this.prisma.user.create({
				data: {
					email: dto.email,
					username: dto.username,
					passwordHash,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
				throw new ConflictException('Username or email already in use')	;
			}
			throw error;
		} 

		const { passwordHash: _, ...safeUser } = user;
		return safeUser;
	}

	async login(dto: LoginDto) {
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

		const [accessToken, refreshToken] = await Promise.all([
			this.issueAccessToken(user),
			this.createRefreshSession(user.id),
		]);

		return { accessToken, refreshToken };
	}

	async refresh(refreshToken: string) {
		const tokenHash = this.hashRefreshToken(refreshToken);
		const session = await this.prisma.refreshSession.findUnique({
			where: { tokenHash },
			include: { user: { select: { id: true, email: true } } },
		});

		if (!session || session.expiresAt <= new Date()) {
			if (session) {
				await this.prisma.refreshSession.delete({ where: { id: session.id } });
			}
			throw new UnauthorizedException('Invalid or expired refresh token');
		}

		// Keep the opaque session token stable until logout/expiry. This makes
		// concurrent refreshes from several requests or browser tabs safe.
		return { accessToken: await this.issueAccessToken(session.user) };
	}

	async logout(accessToken?: string, refreshToken?: string) {
		if (refreshToken) {
			await this.prisma.refreshSession.deleteMany({
				where: { tokenHash: this.hashRefreshToken(refreshToken) },
			});
		}

		if (accessToken) {
			try {
				const payload = await this.jwtService.verifyAsync<JwtPayload>(accessToken);
				await this.prisma.revokedToken.upsert({
					where: { jti: payload.jti },
					create: { jti: payload.jti, expiresAt: new Date(payload.exp * 1000) },
					update: {},
				});
			} catch {
				// An expired access token must not prevent the refresh cookie being cleared.
			}
		}

		return { message: 'Logged out successfully' };
	}

	async verifyAccessToken(token: string): Promise<JwtPayload> {
		let payload: JwtPayload;
		try {
			payload = await this.jwtService.verifyAsync<JwtPayload>(token);
		} catch {
			throw new UnauthorizedException('Invalid or expired token');
		}

		const revoked = await this.prisma.revokedToken.findUnique({
			where: { jti: payload.jti },
		});
		if (revoked) {
			throw new UnauthorizedException('Token has been revoked');
		}
		return payload;
	}
}
