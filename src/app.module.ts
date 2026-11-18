import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphqlApiModule } from './graphql/graphql.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SeedModule,
    HealthModule,
    GraphqlApiModule,
  ],
})
export class AppModule {}