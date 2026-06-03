import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerController } from './url-shortener.controller';
import { CoreService } from './core.service';

describe('CoreController', () => {
  let coreController: UrlShortenerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UrlShortenerController],
      providers: [CoreService],
    }).compile();

    coreController = app.get<UrlShortenerController>(UrlShortenerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(coreController.getHello()).toBe('Hello World!');
    });
  });
});
