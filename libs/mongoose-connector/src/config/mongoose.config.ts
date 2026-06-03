import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';

export class MongooseConfig implements MongooseOptionsFactory {
  @Inject(ConfigService) private readonly configService: ConfigService;

  createMongooseOptions(): MongooseModuleOptions {
    return {
      appName: this.configService.getOrThrow<string>('APPLICATION_NAME'),
      autoCreate: true,
      dbName: this.configService.getOrThrow<string>('MONGODB.DB_NAME'),
      uri: this.configService.getOrThrow<string>('MONGODB.URI'),
      auth: {
        username: this.configService.get<string>('MONGODB.AUTH_USERNAME'),
        password: this.configService.get<string>('MONGODB.AUTH_PASSWORD'),
      },
    };
  }
}
