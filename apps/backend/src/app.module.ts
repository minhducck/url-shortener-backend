import { Module } from '@nestjs/common';
import { CommonModule } from '@libs/common';
import { ShortenerModule } from '../../shortener/src/shortener.module';

@Module({
  imports: [CommonModule, ShortenerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
