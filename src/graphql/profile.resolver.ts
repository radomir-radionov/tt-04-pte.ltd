import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProfileService } from '../profile/profile.service';
import { ProfileLoaders } from './loaders/profile.loaders';
import { ExperienceModel } from './models/experience.model';
import { ProfileLinkModel } from './models/profile-link.model';
import { ProfileModel } from './models/profile.model';
import { ProjectModel } from './models/project.model';
import { SkillModel } from './models/skill.model';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileLoaders: ProfileLoaders,
  ) {}

  @Query(() => ProfileModel, { name: 'profile' })
  async profile(): Promise<ProfileModel> {
    const profile = await this.profileService.getProfile();
    return {
      id: profile.id,
      name: profile.name,
      description: profile.description,
      links: [],
      skills: [],
      experience: [],
      projects: [],
    };
  }

  @ResolveField('skills', () => [SkillModel])
  skills(@Parent() profile: ProfileModel): Promise<SkillDtoLoaded[]> {
    return this.profileLoaders.skillsByProfileId.load(profile.id);
  }

  @ResolveField('experience', () => [ExperienceModel])
  experience(@Parent() profile: ProfileModel): Promise<ExperienceModel[]> {
    return this.profileLoaders.experienceByProfileId.load(profile.id);
  }

  @ResolveField('projects', () => [ProjectModel])
  projects(@Parent() profile: ProfileModel): Promise<ProjectModel[]> {
    return this.profileLoaders.projectsByProfileId.load(profile.id);
  }

  @ResolveField('links', () => [ProfileLinkModel])
  links(@Parent() profile: ProfileModel): Promise<ProfileLinkModel[]> {
    return this.profileLoaders.linksByProfileId.load(profile.id);
  }
}

type SkillDtoLoaded = { id: string; name: string };