import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // Drop anything the DTO does not declare. Services pass the DTO straight
      // to Prisma, so without this a request could set columns it has no
      // business setting, such as email on PATCH /users/me.
      whitelist: true,
      // And say so, rather than silently ignoring the extra field.
      forbidNonWhitelisted: true,
    }),
  );
  // Lets the httpOnly refresh cookie reach the controllers.
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
