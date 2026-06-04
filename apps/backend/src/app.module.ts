import { Module } from '@nestjs/common';
import { CommonModule } from '@libs/common';
import { ShortenerModule } from '../../shortener/src/shortener.module';
import { RouterController } from './http/router.controller';

@Module({
  imports: [CommonModule, ShortenerModule],
  controllers: [RouterController],
  providers: [],
})
export class AppModule {}
