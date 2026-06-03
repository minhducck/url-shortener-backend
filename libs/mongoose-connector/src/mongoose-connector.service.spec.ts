import { Test, TestingModule } from '@nestjs/testing';
import { MongooseConnectorService } from './mongoose-connector.service';

describe('MongooseConnectorService', () => {
  let service: MongooseConnectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongooseConnectorService],
    }).compile();

    service = module.get<MongooseConnectorService>(MongooseConnectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
