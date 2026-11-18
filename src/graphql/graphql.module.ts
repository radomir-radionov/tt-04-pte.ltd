import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ProfileModule } from '../profile/profile.module';
import { ProfileLoaders } from './loaders/profile.loaders';
import { ProfileResolver } from './profile.resolver';
import './enums/link-type.enum';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }: { req: unknown; res: unknown }) => ({ req, res }),
    }),
    ProfileModule,
  ],
  providers: [ProfileResolver, ProfileLoaders],
})
export class GraphqlApiModule {}