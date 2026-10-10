import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // Open for now, so a frontend on another port can call the API. Requests carry
  // a bearer token, not a cookie, so no credentials are involved.
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
