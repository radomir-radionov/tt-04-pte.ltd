import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_PROFILE_SLUG } from '../seed/profile.seed-data';
import type { ProfileDto } from './profile.types';

const profileInclude = {
  links: { orderBy: { sortOrder: 'asc' as const } },
  skills: { orderBy: { sortOrder: 'asc' as const } },
  experiences: { orderBy: { sortOrder: 'asc' as const } },
  projects: { orderBy: { sortOrder: 'asc' as const } },
};

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDefaultProfile(): Promise<ProfileDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { slug: DEFAULT_PROFILE_SLUG },
      include: profileInclude,
    });

    if (!profile) {
      throw new NotFoundException(
        `Profile with slug "${DEFAULT_PROFILE_SLUG}" was not found`,
      );
    }

    return this.mapProfile(profile);
  }

  async getSkillsByProfileIds(profileIds: readonly string[]) {
    return this.prisma.skill.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getExperiencesByProfileIds(profileIds: readonly string[]) {
    return this.prisma.experience.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getProjectsByProfileIds(profileIds: readonly string[]) {
    return this.prisma.project.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getLinksByProfileIds(profileIds: readonly string[]) {
    return this.prisma.profileLink.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  private mapProfile(
    profile: Prisma.ProfileGetPayload<{ include: typeof profileInclude }>,
  ): ProfileDto {
    return {
      id: profile.id,
      name: profile.name,
      description: profile.description,
      links: profile.links.map((link) => ({
        id: link.id,
        type: link.type,
        url: link.url,
      })),
      skills: profile.skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
      })),
      experiences: profile.experiences.map((experience) => ({
        id: experience.id,
        company: experience.company,
        position: experience.position,
        startDate: experience.startDate,
        endDate: experience.endDate,
        achievements: experience.achievements,
      })),
      projects: profile.projects.map((project) => ({
        id: project.id,
        name: project.name,
        url: project.url,
        description: project.description,
      })),
    };
  }
}