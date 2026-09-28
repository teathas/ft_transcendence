import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
	private prisma: PrismaService,
	private jwtService: JwtService,
  ) {}

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

	const playload = { sub: user.id, email: user.email };
	const accessToken = await this.jwtService.signAsync(playload);

	return { accessToken };
  }
}