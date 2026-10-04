import { Controller, Post, Body, HttpCode, HttpStatus, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { extractBearerToken } from './utils/extract-token.uitl';
import { Public } from './decorators/public.decorator'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Public()
	@Post('register')
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@Public()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@Req() request: any) {
		const token = extractBearerToken(request);
		if (!token) {
			throw new UnauthorizedException('No token provided');
		}
		return this.authService.logout(token);
	}
}