import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const PROFILE_QUERY = `
  query ProfileCard {
    profile {
      name
      description
      skills { name }
      experience { company position }
      projects { name }
    }
  }
`;

describe('GraphQL profile (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      console.warn('Skipping GraphQL e2e: DATABASE_URL is not set');
      return;
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('returns seeded profile data', async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: PROFILE_QUERY })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.profile.name).toBe('Radomir Radionov');
    expect(response.body.data.profile.skills.length).toBeGreaterThanOrEqual(10);
    expect(response.body.data.profile.experience[0].company).toBeTruthy();
    expect(response.body.data.profile.projects.length).toBeGreaterThan(0);
  });
});