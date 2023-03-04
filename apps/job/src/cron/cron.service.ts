import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  //   @Cron('*/5 * * * * *')
  //   runEvery10Seconds() {
  //     this.logger.debug('Run it every 5 seconds');
  //   }

  //   @Cron('10 * * * * *')
  //   handleCron() {
  //     this.logger.debug('Called when the current second is 10');
  //   }
}
