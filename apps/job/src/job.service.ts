import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { Order } from 'apps/orders/src/schemas/order.schema';
import { CronJob } from 'cron';
import { CreateJobQueueObject } from './dto/create-job-queue.request';
import { JobQueueRepository } from './job-queue.repository';
@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);
  constructor(private schedulerRegistry: SchedulerRegistry, private jobQueueRepository: JobQueueRepository) {}

  async createJobQueue(user: User, order: Order) {
    const session = await this.jobQueueRepository.startTransaction();
    const job: CreateJobQueueObject = this.createJobQueueObject(order._id.toString(), user);

    try {
      const createJob = await this.jobQueueRepository.create(job, {
        session,
      });
      await session.commitTransaction();
      return createJob;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  private createJobQueueObject(orderId: string, user: User): CreateJobQueueObject {
    return {
      addedBy: user._id.toString(),
      addedDate: new Date(),
      allocatedEmployees: [],
      customer: '',
      desc: '',
      estimatedDate: new Date(),
      estimatedPrice: 0,
      estimatedTime: 0,
      isActive: false,
      name: '',
      project: '',
      allocatedOrder: orderId,
    };
  }

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
