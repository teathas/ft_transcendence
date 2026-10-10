import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { randomUUID } from 'crypto';

export type JwtPayload = { sub: string; email: string; jti: string; exp: number };

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) { }

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

		const playload = { sub: user.id, email: user.email, jti: randomUUID() };
		const accessToken = await this.jwtService.signAsync(playload);

		return { accessToken };
	}

	async logout(token: string) {
		const payload = await this.jwtService.verifyAsync(token);

		await this.prisma.revokedToken.create({
			data: {
				jti: payload.jti,
				expiresAt: new Date(payload.exp * 1000),
			},
		});

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