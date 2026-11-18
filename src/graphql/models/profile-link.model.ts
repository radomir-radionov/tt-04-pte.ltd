import { Field, ID, ObjectType } from '@nestjs/graphql';
import { LinkType } from '../enums/link-type.enum';

@ObjectType('ProfileLink')
export class ProfileLinkModel {
  @Field(() => ID)
  id!: string;

  @Field(() => LinkType)
  type!: LinkType;

  @Field()
  url!: string;
}