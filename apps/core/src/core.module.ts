import { Module } from '@nestjs/common';
import { UrlShortenerController } from './http/url-shortener.controller';
import { CoreService } from './service/core.service';

@Module({
  imports: [],
  controllers: [UrlShortenerController],
  providers: [CoreService],
})
export class CoreModule {}
