import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from '../../prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { extractBearerToken } from '../utils/extract-token.uitl';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor (
		private JwtService: JwtService,
		private prisma: PrismaService,
		private reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const token = extractBearerToken(request);

		if (!token) {
			throw new UnauthorizedException('No token provided');
		}

		let playload: any;
		try {
			playload = await this.JwtService.verifyAsync(token);
		} catch {
			throw new UnauthorizedException('Invalid or expired token');
		}

		const revoked = await this.prisma.revokedToken.findUnique({
			where: { jti: playload.jti },
		});
		if (revoked) {
			throw new UnauthorizedException('Token has been revoked');
		}

		request.user = playload;
		return true;
	}
}