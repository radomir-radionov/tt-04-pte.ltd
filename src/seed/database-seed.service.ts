import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { runProfileSeed } from './profile-seed.runner';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await runProfileSeed(this.prisma);
  }
}