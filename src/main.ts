import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function ensureDatabaseUrl(): void {
  if (process.env.DATABASE_URL) {
    return;
  }
  const fallback =
    process.env.POSTGRES_PRISMA_URL ?? process.env.POSTGRES_URL;
  if (fallback) {
    process.env.DATABASE_URL = fallback;
  }
}

async function bootstrap(): Promise<void> {
  ensureDatabaseUrl();
  const port = Number(process.env.PORT ?? 3000);
  const app = await NestFactory.create(AppModule);
  await app.listen(port, '0.0.0.0');
  Logger.log(`Application running on http://localhost:${port}/graphql`, 'Bootstrap');
}

bootstrap();