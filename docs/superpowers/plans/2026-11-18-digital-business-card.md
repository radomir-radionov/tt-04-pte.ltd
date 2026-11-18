# Digital Business Card — Implementation Plan

> Agentic execution: TDD per stage, conventional commits.

**Goal:** NestJS GraphQL API presenting profile, skills, experience, projects; Docker cold start with migrated + seeded DB.

**Architecture:** Resolver → ProfileService → ProfileRepository → Prisma → PostgreSQL. Request-scoped DataLoaders for nested fields. Idempotent seed on startup when empty.

**Tech Stack:** Node.js, TypeScript, NestJS, Prisma, Apollo GraphQL, PostgreSQL, Docker.

See `docs/architecture.md` for details.