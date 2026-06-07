import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  setupApiVersioning,
  setupStaticAssets,
  setupSwagger,
} from '@libs/common/bootstrap';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  setupStaticAssets(app);
  setupApiVersioning(app);
  setupSwagger(app);
  app.enableCors({ origin: '*' });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
