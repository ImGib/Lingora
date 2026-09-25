import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ENVIRONMENT } from './infrastructure/environment.module.js';
import type { Environment } from './config/environment.js';
import { ApiExceptionFilter } from './http/api-exception.filter.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const environment = app.get<Environment>(ENVIRONMENT);
  app.enableCors({ origin: environment.WEB_ORIGIN, credentials: true });
  app.useGlobalFilters(new ApiExceptionFilter());
  app.enableShutdownHooks();
  await app.listen(environment.PORT);
}

void bootstrap();
