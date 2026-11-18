import { Global, Module } from '@nestjs/common';
import { PrismaMigrateService } from './prisma-migrate.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, PrismaMigrateService],
  exports: [PrismaService],
})
export class PrismaModule {}