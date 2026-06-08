import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ShortenerService } from '../../shortener/src/service/shortener.service';

describe('Shortener API (e2e)', () => {
  let app: INestApplication<App>;
  let shortUrl: ShortenerService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    shortUrl = app.get(ShortenerService);

    // Delete if exist `not_found`
    await shortUrl
      .create({
        original_url: 'https://example.com/',
        custom_url: 'test_sample',
      })
      .catch(() => null);

    await app.init();
  });

  afterAll(async () => {
    await shortUrl.remove('test_sample');
    await app.close();
  });

  it('[POST] Create URL.', async () => {
    const customUrl = `custom_${Date.now()}`;
    const response = await request(app.getHttpServer())
      .post(`/urls`)
      .set('Content-Type', 'application/json')
      .send({
        custom_url: customUrl,
        original_url: 'https://example.com/',
        password: '123456',
      })
      .expect(201);

    expect(customUrl).toEqual(response.body.custom_url);
    expect('https://example.com/').toEqual(response.body.original_url);
    expect(response.body).toHaveProperty('password');
    await shortUrl.remove('customUrl');
  });

  it('[POST] Very long URLs', async () => {
    const response = await request(app.getHttpServer())
      .post(`/urls`)
      .set('Content-Type', 'application/json')
      .send({
        original_url: 'http://' + 'a'.repeat(10000),
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain(
      'original_url must be shorter than or equal to 256 characters',
    );
    expect(response.body.message).toContain(
      'URL should be a valid HTTP/HTTPS value.',
    );
  });

  it('[POST] Invalid Protocols', async () => {
    const response = await request(app.getHttpServer())
      .post(`/urls`)
      .set('Content-Type', 'application/json')
      .send({
        original_url: 'sftp://example.com/',
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain(
      'URL should be a valid HTTP/HTTPS value.',
    );
  });

  it('[GET] url', async () => {
    const response = await request(app.getHttpServer())
      .get(`/urls/test_sample`)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(response.body).not.toHaveProperty('message');
    expect(response.body).not.toHaveProperty('password');
  });
});
