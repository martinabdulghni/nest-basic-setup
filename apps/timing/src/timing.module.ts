import { Module } from '@nestjs/common';
import { TimingController } from './timing.controller';
import { TimingService } from './timing.service';

@Module({
  imports: [],
  controllers: [TimingController],
  providers: [TimingService],
})
export class TimingModule {}
