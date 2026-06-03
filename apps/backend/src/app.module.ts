import { Module } from '@nestjs/common';
import { CommonModule } from '@libs/common';
import { CoreModule } from '../../core/src/core.module';

@Module({
  imports: [CommonModule, CoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
