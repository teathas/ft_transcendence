import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Unknown fields are dropped from every body and query before a handler sees them.
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // Open for now, so a frontend on another port can call the API: any origin,
  // method and header. Requests carry a bearer token, not a cookie, so no
  // credentials are involved. To remove once nginx serves both on one origin.
  app.enableCors();
  // Lets the live boards write their last state when the process is stopped.
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
