# Digital Business Card API

Backend digital visit card for **Radomir Radionov**: NestJS + TypeScript + Prisma + GraphQL (Apollo Sandbox) + PostgreSQL + Docker.

## Architecture decisions

| Topic | Choice | Why |
|-------|--------|-----|
| Layers | Resolver → Service → Repository → Prisma | Keeps GraphQL thin; business rules testable without HTTP |
| API style | GraphQL code-first | Strong typing with NestJS decorators; schema generated to `src/schema.gql` |
| Nested data | Request-scoped **DataLoader** on field resolvers | Batches related rows by `profileId`; avoids N+1 when the graph grows |
| Bootstrap data | `DatabaseSeedService` on module init if DB empty | Satisfies “zero install → filled DB” for Docker and local |
| Migrations | `prisma migrate deploy` in Docker entrypoint | Reproducible schema before app start |
| Singleton profile | `slug = default` | One public card; easy to extend later with `profile(slug: String)` |

See [docs/architecture.md](docs/architecture.md) for more detail.

## Quick start (Docker)

```bash
docker compose up --build
```

- API: [http://localhost:3000/graphql](http://localhost:3000/graphql) (Apollo Sandbox)
- Health: [http://localhost:3000/health](http://localhost:3000/health)

On first start: migrations run, then the app seeds your profile if the database is empty.

## Example query

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

## Local development

```bash
cp .env.example .env
docker compose up -d db
npm run prisma:generate
npx prisma migrate dev
npm run start:dev
```

## Tests (TDD)

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/digital_card?schema=public"
npm test
npm run test:e2e
```

Unit tests run without a database; integration/e2e tests skip when `DATABASE_URL` is unset.

## Deploy

Any platform with Docker or Node 20 + PostgreSQL (Render, Railway, Fly.io):

1. Provision Postgres and set `DATABASE_URL`.
2. Build image from `Dockerfile` or run `npm run build` + `prisma migrate deploy`.
3. Expose port `3000` and open `/graphql`.

## Links

- **Repository:** https://github.com/radomir-radionov/tt-04-pte.ltd
- **Profile:** [GitHub @radomir-radionov](https://github.com/radomir-radionov)
- **CV in repo:** `Radomir_CV_React.pdf`

### Live API (Render)

**Option A — one command (API key):**

1. [Create an API key](https://dashboard.render.com/u/settings#api-keys) (read/write).
2. Run: `RENDER_API_KEY=rnd_xxx npm run deploy:render`
3. Open the printed URL → `/graphql` (Apollo Sandbox).

**Option B — Blueprint UI:** [New Blueprint](https://dashboard.render.com/blueprints) → repo `tt-04-pte.ltd` → apply `render.yaml`.