import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ExperienceModel } from './experience.model';
import { ProfileLinkModel } from './profile-link.model';
import { ProjectModel } from './project.model';
import { SkillModel } from './skill.model';

@ObjectType('Profile')
export class ProfileModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => [ProfileLinkModel])
  links!: ProfileLinkModel[];

  @Field(() => [SkillModel])
  skills!: SkillModel[];

  @Field(() => [ExperienceModel])
  experience!: ExperienceModel[];

  @Field(() => [ProjectModel])
  projects!: ProjectModel[];
}