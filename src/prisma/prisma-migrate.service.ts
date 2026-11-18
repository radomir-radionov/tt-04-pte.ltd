import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { execSync } from 'node:child_process';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaMigrateService implements OnModuleInit {
  private readonly logger = new Logger(PrismaMigrateService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    if (
      process.env.SKIP_PRISMA_MIGRATE === '1' ||
      process.env.VERCEL === '1'
    ) {
      return;
    }

    try {
      execSync('npx prisma migrate deploy', {
        stdio: 'pipe',
        env: process.env,
      });
      this.logger.log('Prisma migrations applied');
    } catch (error) {
      this.logger.error('Prisma migrate deploy failed', error);
      throw error;
    }
  }
}