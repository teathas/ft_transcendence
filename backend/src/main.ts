import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PublicApiModule } from './public-api/public-api.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Unknown fields are dropped from every body and query before a handler sees them.
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // Lets the live boards write their last state when the process is stopped.
  app.enableShutdownHooks();

  const openApiConfig = new DocumentBuilder()
    .setTitle('Shared Room Public API')
    .setDescription('Manage your Shared Room rooms from an external client.')
    .setVersion('1.0')
    .addServer('/api')
    .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'api-key')
    .build();
  const openApiDocument = SwaggerModule.createDocument(app, openApiConfig, {
    include: [PublicApiModule],
  });
  SwaggerModule.setup('api/docs', app, openApiDocument, {
    jsonDocumentUrl: 'api/docs-json',
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
