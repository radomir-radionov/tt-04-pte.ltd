import { PrismaClient } from '@prisma/client';
import { runProfileSeed } from './profile-seed.runner';
import { profileSeedData } from './profile.seed-data';

describe('runProfileSeed', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    if (!process.env.DATABASE_URL) {
      return;
    }
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma?.$disconnect();
  });

  it('is idempotent when a profile already exists', async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    await prisma.profile.deleteMany();

    await runProfileSeed(prisma);
    await runProfileSeed(prisma);

    const count = await prisma.profile.count();
    expect(count).toBe(1);

    const profile = await prisma.profile.findUnique({
      where: { slug: profileSeedData.slug },
      include: { skills: true, projects: true },
    });

    expect(profile?.name).toBe(profileSeedData.name);
    expect(profile?.skills.length).toBe(profileSeedData.skills.length);
    expect(profile?.projects.length).toBe(profileSeedData.projects.length);
  });
});