import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix(`/api`)

    await app.init();
  });

  it('/api (GET) (Проверка работы сервера)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Server worked!');
  });
});
