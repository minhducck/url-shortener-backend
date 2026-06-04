import { NestFactory } from '@nestjs/core';
import { ShortenerModule } from './shortener.module';

async function bootstrap() {
  const app = await NestFactory.create(ShortenerModule);
  await app.listen(process.env.port ?? 3000);
}

void bootstrap();
