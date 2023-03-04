import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  addCronJob(name: string, seconds: string) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      this.logger.warn(`time (${seconds}) for job ${name} to run!`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    return `job ${name} added for each minute at ${seconds} seconds!`;
  }

  deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`job ${name} deleted!`);
  }

  getCrons(): { details: string } {
    const jobs = this.schedulerRegistry.getCronJobs();
    let details: { details: string };

    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDates().toJSDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      details = { details: `job: ${key} -> next: ${next}` };
    });
    return details;
  }
}
