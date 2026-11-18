import { LinkType } from '@prisma/client';

export const DEFAULT_PROFILE_SLUG = 'default';

export type ProfileSeedData = {
  slug: string;
  name: string;
  description: string;
  links: ReadonlyArray<{ type: LinkType; url: string; sortOrder: number }>;
  skills: ReadonlyArray<{ name: string; sortOrder: number }>;
  experiences: ReadonlyArray<{
    company: string;
    position: string;
    startDate: Date;
    endDate: Date | null;
    achievements: string[];
    sortOrder: number;
  }>;
  projects: ReadonlyArray<{
    name: string;
    url: string;
    description?: string;
    sortOrder: number;
  }>;
};

const skillNames = [
  'React',
  'TypeScript',
  'Next.js',
  'Node.js',
  'NestJS',
  'GraphQL',
  'Prisma',
  'PostgreSQL',
  'Express',
  'TanStack Query',
  'Redis',
  'Docker',
  'Git',
  'GitHub Actions',
  'Jest',
  'Cypress',
  'Tailwind CSS',
  'ClickHouse',
  'Zod',
  'CI/CD',
];

export const profileSeedData: ProfileSeedData = {
  slug: DEFAULT_PROFILE_SLUG,
  name: 'Radomir Radionov',
  description:
    'Full Stack Engineer (Minsk, Belarus). 3+ years shipping React, Next.js, Node.js, and TypeScript end to end — UI, APIs, and databases. Depth in product analytics (session replay, ClickHouse), Next.js admin/public stacks with Prisma, and public React/TypeScript UI libraries.',
  links: [
    {
      type: LinkType.GITHUB,
      url: 'https://github.com/radomir-radionov',
      sortOrder: 0,
    },
    {
      type: LinkType.LINKEDIN,
      url: 'https://www.linkedin.com/in/radomir-radionov/',
      sortOrder: 1,
    },
    {
      type: LinkType.OTHER,
      url: 'https://t.me/Radomir_01',
      sortOrder: 2,
    },
  ],
  skills: skillNames.map((name, sortOrder) => ({ name, sortOrder })),
  experiences: [
    {
      company: 'NDA',
      position: 'Full Stack Engineer',
      startDate: new Date('2026-04-01'),
      endDate: null,
      achievements: [
        'Financial intelligence platform: Next.js, TypeScript, Elixir backend with projection-driven design and real-time data.',
        'AI-assisted delivery with coding agents across features, debugging, testing, and documentation.',
        'Shipped feeds, creator tools, onboarding, analytics, and operator dashboards with consistent architecture.',
      ],
      sortOrder: 0,
    },
    {
      company: 'XB Software',
      position: 'Software Engineer',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2026-04-01'),
      achievements: [
        'Shipped 20+ public React/TypeScript library components (SVAR, DHTMLX) with stable props, types, and release notes.',
        'Improved legacy hotspots ~20–30% on demo screens; Cypress E2E in CI cut regressions ~40% on covered flows.',
        'Aligned widgets across Vue, Angular, and Svelte packages with the React build for consistent integrator APIs.',
      ],
      sortOrder: 1,
    },
    {
      company: 'Ars Magnum',
      position: 'Full Stack Engineer',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-04-01'),
      achievements: [
        'High-volume analytics ingest to ClickHouse; session replay and Canvas heatmaps; sensitive field masking at ingest.',
        'Express + Prisma + PostgreSQL + Redis; JWT rotation with jti in Redis; Bull workers for long PDF exports.',
        'Docs AI: parse uploads, proxy to company LLM, SSE streaming to React UI — owned prompts, grounding, and UX.',
      ],
      sortOrder: 2,
    },
    {
      company: 'SLMax',
      position: 'Full Stack Engineer',
      startDate: new Date('2023-11-01'),
      endDate: new Date('2024-07-01'),
      achievements: [
        'Two Next.js apps (admin + public) on one Postgres schema; Prisma migrations on Railway.',
        'Admin page builder and Route Handlers with Zod; NextAuth Google OAuth with HttpOnly sessions.',
        'GitHub Actions CI with prisma migrate deploy; ~25% less initial JS on key admin routes via memo and dynamic import.',
      ],
      sortOrder: 3,
    },
    {
      company: 'Algoritmika',
      position: 'Part-time Frontend Mentor',
      startDate: new Date('2022-08-01'),
      endDate: new Date('2025-07-01'),
      achievements: [
        'Led JavaScript study groups: pacing, homework code review, and student engagement through advanced topics.',
      ],
      sortOrder: 4,
    },
  ],
  projects: [
    {
      name: 'tt-04-pte.ltd',
      url: 'https://github.com/radomir-radionov/tt-04-pte.ltd',
      description:
        'This digital business card API (NestJS, GraphQL, Prisma, Docker).',
      sortOrder: 0,
    },
    {
      name: 'tt-02-maddevs',
      url: 'https://github.com/radomir-radionov/tt-02-maddevs',
      description: 'Meeting room booking UI (Next.js test task).',
      sortOrder: 1,
    },
    {
      name: 'paralect-chatgpt-clone',
      url: 'https://github.com/radomir-radionov/paralect-chatgpt-clone',
      description: 'ChatGPT-style client (TypeScript).',
      sortOrder: 2,
    },
    {
      name: 'tt-03-etolegko',
      url: 'https://github.com/radomir-radionov/tt-03-etolegko',
      description: 'Console internet download speed measure (Node.js).',
      sortOrder: 3,
    },
    {
      name: 'bookLibraryApp',
      url: 'https://github.com/radomir-radionov/bookLibraryApp',
      description: 'Library management application.',
      sortOrder: 4,
    },
  ],
};