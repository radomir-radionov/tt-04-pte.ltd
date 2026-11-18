import { LinkType } from '@prisma/client';

export type ProfileLinkDto = {
  id: string;
  type: LinkType;
  url: string;
};

export type SkillDto = {
  id: string;
  name: string;
};

export type ExperienceDto = {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  achievements: string[];
};

export type ProjectDto = {
  id: string;
  name: string;
  url: string;
  description: string | null;
};

export type ProfileDto = {
  id: string;
  name: string;
  description: string;
  links: ProfileLinkDto[];
  skills: SkillDto[];
  experiences: ExperienceDto[];
  projects: ProjectDto[];
};