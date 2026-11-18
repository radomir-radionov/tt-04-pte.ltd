# Architecture

## Layers

| Layer | Responsibility |
|-------|----------------|
| GraphQL resolvers | Map GraphQL operations to service calls; field resolvers use DataLoaders |
| `ProfileService` | Application use cases (`getProfile`) |
| `ProfileRepository` | Prisma queries and DTO mapping |
| Prisma | Schema, migrations, seed |
| `DatabaseSeedService` | Runs seed when no profile exists (cold start / Docker) |

Resolvers do not import `PrismaClient` directly.

## Data model

- **Profile** — `slug` (unique, singleton `default`), `name`, `description`
- **ProfileLink** — `type` (`GITHUB` \| `LINKEDIN` \| `OTHER`), `url`
- **Skill** — `name`, `sortOrder`
- **Experience** — `company`, `position`, `startDate`, `endDate?`, `achievements` (`String[]`)
- **Project** — `name`, `url`, optional `description`

Relations: Profile 1—N for all child entities. `onDelete: Cascade` from profile.

## GraphQL

Code-first (`@nestjs/graphql` + Apollo). Root query:

```graphql
query {
  profile {
    name
    description
    links { type url }
    skills { name }
    experience { company position achievements }
    projects { name url }
  }
}
```

## N+1 strategy

Default path: `ProfileRepository.getDefaultProfile()` loads profile with `include` for all relations in **one** query when resolving root `profile`.

Field resolvers on `Profile` use DataLoaders (`skills`, `experience`, `projects`, `links`) batched by `profileId` for consistency and for future multi-profile extension.

## Bootstrap

1. `prisma migrate deploy`
2. App starts → `DatabaseSeedService.onModuleInit` → if no profile, run seed
3. Apollo Sandbox at `/graphql`

## Testing

- **Unit/integration:** Jest + real PostgreSQL (`TEST_DATABASE_URL` or compose test DB)
- **E2E:** Supertest against Nest app + assignment GraphQL query