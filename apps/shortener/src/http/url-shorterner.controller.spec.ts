import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerController } from './url-shortener.controller';
import { ShortenerService } from '../service/shortener.service';
import { UrlModel, UrlModelDefinition } from '../model/url.model';
import { MongooseConnectorModule } from '@libs/mongoose-connector';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalCounterDefinition } from '../model/global-counter.model';
import { CodeGeneratorService } from '../service/code-generator.service';
import { NotFoundException } from '@nestjs/common';

describe('UrlShortenerController', () => {
  let module: TestingModule;
  let urlShortenerController: UrlShortenerController;
  let urlShortenService: ShortenerService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseConnectorModule,
        MongooseModule.forFeature([
          UrlModelDefinition,
          GlobalCounterDefinition,
        ]),
      ],
      controllers: [UrlShortenerController],
      providers: [ShortenerService, CodeGeneratorService],
    }).compile();

    urlShortenerController = module.get<UrlShortenerController>(
      UrlShortenerController,
    );
    urlShortenService = module.get(ShortenerService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('Get URL settings', () => {
    it('URL exist and valid', async () => {
      const code = 'hello-world';
      const mockResponse: UrlModel = {
        original_url: 'https://shortener.com',
        expiration_date: null,
        custom_url: 'hello-world',
        created_at: new Date(),
        shortcode: code,
        password: '123456',
      };

      jest
        .spyOn(urlShortenService, 'getUrlByCode')
        .mockImplementation(() => Promise.resolve<UrlModel>(mockResponse));

      await expect(urlShortenerController.getUrlSetting(code)).resolves.toBe(
        mockResponse,
      );
    });
    it('Short url does not exist', async () => {
      jest
        .spyOn(urlShortenService, 'isCodeExist')
        .mockImplementation(() => Promise.resolve<boolean>(false));
      await expect(
        urlShortenerController.getUrlSetting('code'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
