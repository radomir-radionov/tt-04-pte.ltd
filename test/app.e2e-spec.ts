import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Apollo Sandbox (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
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

  it('GET /graphql exposes Apollo landing page', async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    const response = await request(app.getHttpServer()).get('/graphql');
    expect(response.status).toBe(200);
    expect(response.text).toContain('graphql');
  });
});