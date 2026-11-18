import { PrismaClient } from '@prisma/client';
import { profileSeedData } from './profile.seed-data';

export async function runProfileSeed(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.profile.count();
  if (existing > 0) {
    return;
  }

  const { links, skills, experiences, projects, ...profile } = profileSeedData;

  await prisma.profile.create({
    data: {
      ...profile,
      links: { create: [...links] },
      skills: { create: [...skills] },
      experiences: { create: [...experiences] },
      projects: { create: [...projects] },
    },
  });
}