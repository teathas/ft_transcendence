import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response, CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { extractBearerToken } from './utils/extract-token.uitl';
import { Public } from './decorators/public.decorator'

@Controller('auth')
export class AuthController {
	private readonly refreshCookieName = 'refresh_token';

	constructor(
		private authService: AuthService,
		private config: ConfigService,
	) { }

	private cookieOptions(): CookieOptions {
		return {
			httpOnly: true,
			secure: this.config.get<string>('NODE_ENV') === 'production',
			sameSite: 'strict',
			path: this.config.get<string>('REFRESH_COOKIE_PATH') ?? '/api/auth',
			maxAge: parseInt(this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN') ?? '604800', 10) * 1000,
		};
	}

	private clearCookieOptions(): CookieOptions {
		const { maxAge: _, ...options } = this.cookieOptions();
		return options;
	}

	/**
	 * Older versions set the cookie on other paths (e.g. '/'). The browser keeps
	 * those as separate cookies and sends them all, so we expire them here to
	 * guarantee a single refresh_token.
	 */
	private clearLegacyCookies(response: Response) {
		const { path } = this.cookieOptions();
		for (const legacyPath of ['/', '/api', '/auth', '/api/auth/refresh', '/api/auth/login']) {
			if (legacyPath !== path) response.clearCookie(this.refreshCookieName, { ...this.clearCookieOptions(), path: legacyPath });
		}
	}

	private readRefreshToken(request: Request) {
		const cookies = request.headers.cookie?.split(';') ?? [];
		for (const cookie of cookies) {
			const [name, ...value] = cookie.trim().split('=');
			if (name === this.refreshCookieName) return decodeURIComponent(value.join('='));
		}
		return undefined;
	}

	@Public()
	@Post('register')
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@Public()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
		const { accessToken, refreshToken } = await this.authService.login(dto);
		this.clearLegacyCookies(response);
		response.cookie(this.refreshCookieName, refreshToken, this.cookieOptions());
		return { accessToken };
	}

	@Public()
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
		const currentToken = this.readRefreshToken(request);
		if (!currentToken) throw new UnauthorizedException('No refresh token provided');

		this.clearLegacyCookies(response);
		try {
			return await this.authService.refresh(currentToken);
		} catch (error) {
			response.clearCookie(this.refreshCookieName, this.clearCookieOptions());
			throw error;
		}
	}

	@Public()
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
		const accessToken = extractBearerToken(request);
		const refreshToken = this.readRefreshToken(request);
		await this.authService.logout(accessToken, refreshToken);
		this.clearLegacyCookies(response);
		response.clearCookie(this.refreshCookieName, this.clearCookieOptions());
		return { message: 'Logged out successfully' };
	}
}
