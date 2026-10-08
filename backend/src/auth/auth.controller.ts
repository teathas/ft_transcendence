import {
	Controller, Post, Body, HttpCode, HttpStatus, Req, Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService, IssuedSession } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { extractBearerToken } from './utils/extract-token.uitl';
import { Public } from './decorators/public.decorator'

export const REFRESH_COOKIE = 'refresh_token';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private config: ConfigService,
	) { }

	/**
	 * The cookie path is what the *browser* sees, which is not the route the
	 * backend serves: behind nginx the API lives under /api. Narrowing it keeps
	 * the refresh token off every other request.
	 */
	private cookiePath(): string {
		return this.config.get<string>('REFRESH_COOKIE_PATH') ?? '/';
	}

	/**
	 * Explicit rather than derived from NODE_ENV: Chrome makes an exception for
	 * http://localhost, but a Secure cookie over plain http is dropped anywhere
	 * else — a LAN address, another browser. Must be true once TLS is in front.
	 */
	private cookieSecure(): boolean {
		return (this.config.get<string>('REFRESH_COOKIE_SECURE') ?? 'false') === 'true';
	}

	private setRefreshCookie(res: Response, session: IssuedSession) {
		res.cookie(REFRESH_COOKIE, session.refreshToken, {
			httpOnly: true,
			secure: this.cookieSecure(),
			sameSite: 'lax',
			path: this.cookiePath(),
			expires: session.refreshExpiresAt,
		});
	}

	private clearRefreshCookie(res: Response) {
		res.clearCookie(REFRESH_COOKIE, { path: this.cookiePath() });
	}

	@Public()
	@Post('register')
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@Public()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(
		@Body() dto: LoginDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const session = await this.authService.login(dto);
		this.setRefreshCookie(res, session);
		// Only the access token travels in the body; the refresh token never
		// leaves the cookie, so no script can read it.
		return { accessToken: session.accessToken };
	}

	/**
	 * Public on purpose: the caller has no usable access token, that is the
	 * whole point. Authority comes from the httpOnly cookie.
	 */
	@Public()
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const token = req.cookies?.[REFRESH_COOKIE];
		const session = await this.authService.refresh(token);
		this.setRefreshCookie(res, session);
		return { accessToken: session.accessToken };
	}

	@Public()
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const result = await this.authService.logout(
			extractBearerToken(req),
			req.cookies?.[REFRESH_COOKIE],
		);
		this.clearRefreshCookie(res);
		return result;
	}
}
