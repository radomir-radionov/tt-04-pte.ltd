import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { ProfileRepository } from '../../profile/profile.repository';
import type { ExperienceDto, ProfileLinkDto, ProjectDto, SkillDto } from '../../profile/profile.types';

@Injectable({ scope: Scope.REQUEST })
export class ProfileLoaders {
  readonly skillsByProfileId: DataLoader<string, SkillDto[]>;
  readonly experienceByProfileId: DataLoader<string, ExperienceDto[]>;
  readonly projectsByProfileId: DataLoader<string, ProjectDto[]>;
  readonly linksByProfileId: DataLoader<string, ProfileLinkDto[]>;

  constructor(private readonly profileRepository: ProfileRepository) {
    this.skillsByProfileId = new DataLoader(async (profileIds) => {
      const rows = await this.profileRepository.getSkillsByProfileIds(profileIds);
      return profileIds.map((profileId) =>
        rows
          .filter((row) => row.profileId === profileId)
          .map((row) => ({ id: row.id, name: row.name })),
      );
    });

    this.experienceByProfileId = new DataLoader(async (profileIds) => {
      const rows =
        await this.profileRepository.getExperiencesByProfileIds(profileIds);
      return profileIds.map((profileId) =>
        rows
          .filter((row) => row.profileId === profileId)
          .map((row) => ({
            id: row.id,
            company: row.company,
            position: row.position,
            startDate: row.startDate,
            endDate: row.endDate,
            achievements: row.achievements,
          })),
      );
    });

    this.projectsByProfileId = new DataLoader(async (profileIds) => {
      const rows = await this.profileRepository.getProjectsByProfileIds(profileIds);
      return profileIds.map((profileId) =>
        rows
          .filter((row) => row.profileId === profileId)
          .map((row) => ({
            id: row.id,
            name: row.name,
            url: row.url,
            description: row.description,
          })),
      );
    });

    this.linksByProfileId = new DataLoader(async (profileIds) => {
      const rows = await this.profileRepository.getLinksByProfileIds(profileIds);
      return profileIds.map((profileId) =>
        rows
          .filter((row) => row.profileId === profileId)
          .map((row) => ({
            id: row.id,
            type: row.type,
            url: row.url,
          })),
      );
    });
  }
}