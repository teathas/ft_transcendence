import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Own body parser: a board snapshot outgrows express's 100 kB default.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  app.useBodyParser('json', { limit: '5mb' });
  app.useBodyParser('urlencoded', { extended: true, limit: '1mb' });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // Open for now, so a frontend on another port can call the API. Requests carry
  // a bearer token, not a cookie, so no credentials are involved.
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
