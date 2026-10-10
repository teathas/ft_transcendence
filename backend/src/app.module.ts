import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, sep } from 'path'
import { FriendsModule } from './friends/friends.module';
import { MessagesModule } from './messages/messages.module';
import { RealtimeModule } from './realtime/realtime.module';
import { DirectMessagesModule } from './direct-messages/direct-messages.module';
import { BoardSyncModule } from './board-sync/board-sync.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		AuthModule,
		UsersModule,
		RoomsModule,
		ServeStaticModule.forRoot({
			rootPath: join(process.env.UPLOAD_DIR ?? '/app/uploads'),
			serveRoot: '/uploads',
			serveStaticOptions: {
				// Room files are anyone's bytes: download them, never render them
				// from our address, and never let the browser guess a type.
				setHeaders: (res, path) => {
					res.setHeader('X-Content-Type-Options', 'nosniff');
					if (path.includes(`${sep}rooms${sep}`)) {
						res.setHeader('Content-Disposition', 'attachment');
					}
				},
			},
		}),
		MessagesModule,
		FriendsModule,
		RealtimeModule,
		DirectMessagesModule,
		BoardSyncModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule { }
