# Digital Business Card API

Backend digital visit card for **Radomir Radionov**: NestJS + TypeScript + Prisma + GraphQL (Apollo Sandbox) + PostgreSQL + Docker.

## For reviewers

|                  |                                                                        |
| ---------------- | ---------------------------------------------------------------------- |
| **Live API**     | https://tt-04-digital-card.vercel.app/graphql (Apollo Sandbox)         |
| **Health**       | https://tt-04-digital-card.vercel.app/health                           |
| **Repository**   | https://github.com/radomir-radionov/tt-04-pte.ltd                      |
| **From zero**    | `docker compose up --build` → http://localhost:3000/graphql            |
| **Architecture** | This file (table below) + [docs/architecture.md](docs/architecture.md) |

## Architecture decisions

| Topic             | Choice                                           | Why                                                                                          |
| ----------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Layers            | Resolver → Service → Repository → Prisma         | Keeps GraphQL thin; business rules testable without HTTP                                     |
| API style         | GraphQL code-first                               | NestJS decorators; `autoSchemaFile: true` (in-memory schema — works on read-only serverless) |
| Nested data       | Request-scoped **DataLoader** on field resolvers | Batches related rows by `profileId`; avoids N+1 when the graph grows                         |
| Bootstrap data    | `DatabaseSeedService` on module init if DB empty | Satisfies “zero install → filled DB” for Docker and local                                    |
| Migrations        | `prisma migrate deploy` in Docker entrypoint     | Reproducible schema before app start                                                         |
| Singleton profile | `slug = default`                                 | One public card; easy to extend later with `profile(slug: String)`                           |

See [docs/architecture.md](docs/architecture.md) for more detail.

## Quick start (Docker)

```bash
docker compose up --build
```

- API: [http://localhost:3000/graphql](http://localhost:3000/graphql) (Apollo Sandbox)
- Health: [http://localhost:3000/health](http://localhost:3000/health)

On first start: migrations run, then the app seeds your profile if the database is empty.

If **port 3000** is already in use on the host, change the `app` `ports` mapping (e.g. `3001:3000`) or stop the conflicting process. For local Prisma from the host, DB is published as **5434** (not 5432) to avoid clashing with a system Postgres.

## Example query

```graphql
query {
  profile {
    name
    description
    links {
      type
      url
    }
    skills {
      name
    }
    experience {
      company
      position
      achievements
    }
    projects {
      name
      url
    }
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
export DATABASE_URL="postgresql://postgres:postgres@localhost:5434/digital_card?schema=public"
npm test
npm run test:e2e
```

Unit tests run without a database; integration/e2e tests skip when `DATABASE_URL` is unset.

## Deploy (Docker)

1. Provision Postgres and set `DATABASE_URL`.
2. Build from `Dockerfile` (`docker compose up --build`) or run `npm run build` + `prisma migrate deploy`.
3. Expose port `3000` and open `/graphql`.

## Links

- **Repository:** https://github.com/radomir-radionov/tt-04-pte.ltd
- **Profile:** [GitHub @radomir-radionov](https://github.com/radomir-radionov)
- **CV in repo:** `Radomir_CV_React.pdf`

### Live API (Vercel)

- **Production:** https://tt-04-digital-card.vercel.app/graphql (Apollo Sandbox)
- **Health:** https://tt-04-digital-card.vercel.app/health
- **Dashboard:** https://vercel.com/radomirs-projects/tt-04-digital-card

Postgres: Neon (Vercel integration `neon-blue-grass`). Migrations run at build time (`prisma migrate deploy`).
