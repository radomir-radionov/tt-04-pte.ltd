import { registerEnumType } from '@nestjs/graphql';
import { LinkType } from '@prisma/client';

registerEnumType(LinkType, { name: 'LinkType' });

export { LinkType };