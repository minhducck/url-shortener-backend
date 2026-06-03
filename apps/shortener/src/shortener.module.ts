import { Module } from '@nestjs/common';
import { UrlShortenerController } from './http/url-shortener.controller';
import { ShortenerService } from './service/shortener.service';
import {CodeGeneratorService} from "./service/code-generator.service";

@Module({
  imports: [],
  controllers: [UrlShortenerController],
  providers: [ShortenerService, CodeGeneratorService],
})
export class ShortenerModule {}
