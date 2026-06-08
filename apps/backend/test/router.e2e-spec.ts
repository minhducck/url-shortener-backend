import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { ShortenerService } from '../../shortener/src/service/shortener.service';
import { UrlCreationDto } from '../../shortener/src/dto/url-creation.dto';

describe('RouterController (e2e)', () => {
  let app: INestApplication<App>;
  let shortUrl: ShortenerService;

  const testData: {
    [k: string]: UrlCreationDto & { shortcode?: string };
  } = {
    normal: {
      original_url: 'https://example.com/',
      password: 'update_password',
      expiration_date: null,
    }, // Normal Case,
    expired: {
      custom_url: 'expired',
      original_url: 'https://example.com/',
      password: 'update_password',
      expiration_date: '2021-06-01T12:00:00.000Z',
    },
    custom_url: {
      custom_url: 'open_with_custom_url',
      original_url: 'https://open.gov.sg/',
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    shortUrl = app.get(ShortenerService);

    for (const testCaseKey of Object.keys(testData)) {
      const created = await shortUrl
        .create(testData[testCaseKey])
        .catch(() => null);
      testData[testCaseKey].shortcode = created?.shortcode;
    }

    // Delete if exist `not_found`
    await shortUrl.remove('not_found').catch(() => null);

    await app.init();
  });

  afterAll(async () => {
    for (const testCaseKey of Object.keys(testData)) {
      await shortUrl.remove(testData[testCaseKey].shortcode!);
    }
    await app.close();
  });

  it('[GET] URL with redirection.', () => {
    const testCase = testData['normal'];
    return request(app.getHttpServer())
      .get(`/${testCase.shortcode}`)
      .expect(302)
      .expect(`Found. Redirecting to ${testCase.original_url}`);
  });

  it('[GET] Non exist URL.', () => {
    return request(app.getHttpServer())
      .get(`/not_found`)
      .expect(404)
      .expect(`URL Not Found.`);
  });

  it('[GET] Expired URL.', () => {
    return request(app.getHttpServer())
      .get(`/expired`)
      .expect(404)
      .expect(`URL Not Found.`);
  });

  it('[GET] Custom URL.', () => {
    const test = testData['custom_url'];
    return request(app.getHttpServer())
      .get(`/${test.custom_url}`)
      .expect(302)
      .expect(`Found. Redirecting to ${test.original_url}`);
  });
});
