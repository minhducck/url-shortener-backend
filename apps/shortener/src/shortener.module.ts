import { Module } from '@nestjs/common';
import { UrlShortenerController } from './http/url-shortener.controller';
import { ShortenerService } from './service/shortener.service';
import { CodeGeneratorService } from './service/code-generator.service';
import { MongooseConnectorModule } from '@libs/mongoose-connector';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlModelDefinition } from './model/url.model';
import { GlobalCounterDefinition } from './model/global-counter.model';
import { UrlBuilderInterceptor } from './interceptor/url-builder.interceptor';

@Module({
  imports: [
    MongooseConnectorModule,
    MongooseModule.forFeature([UrlModelDefinition, GlobalCounterDefinition]),
  ],
  controllers: [UrlShortenerController],
  providers: [ShortenerService, CodeGeneratorService, UrlBuilderInterceptor],
  exports: [ShortenerService],
})
export class ShortenerModule {}
