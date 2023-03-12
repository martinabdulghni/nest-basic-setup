import { Controller, Get } from '@nestjs/common';
import { TimingService } from './timing.service';

@Controller()
export class TimingController {
  constructor(private readonly timingService: TimingService) {}

  @Get()
  getHello(): string {
    return this.timingService.getHello();
  }
}
