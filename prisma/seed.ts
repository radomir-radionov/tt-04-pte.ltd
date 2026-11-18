import { PrismaClient } from '@prisma/client';
import { runProfileSeed } from '../src/seed/profile-seed.runner';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await runProfileSeed(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });