import { Module } from '@nestjs/common';
import { MongooseConnectorService } from './mongoose-connector.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { MongooseConfig } from '@libs/mongoose-connector/config/mongoose.config';
import { CommonModule } from '@libs/common';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [MongooseConnectorService],
  exports: [MongooseConnectorService, MongooseModule],
})
export class MongooseConnectorModule {}
