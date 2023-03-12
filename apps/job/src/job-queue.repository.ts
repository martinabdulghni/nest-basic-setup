import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { JobQueue } from './schemas/job-queue.schema';
@Injectable()
export class JobQueueRepository extends AbstractRepository<JobQueue> {
  protected readonly logger = new Logger(JobQueueRepository.name);

  constructor(@InjectModel(JobQueue.name) orderModel: Model<JobQueue>, @InjectConnection() connection: Connection) {
    super(orderModel, connection);
  }
}
