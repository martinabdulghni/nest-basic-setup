import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Billing } from './schemas/billing.schema';

@Injectable()
export class BillingRepository extends AbstractRepository<Billing> {
  protected readonly logger = new Logger(BillingRepository.name);

  constructor(
    @InjectModel(Billing.name) billingModel: Model<Billing>,
    @InjectConnection() connection: Connection,
  ) {
    super(billingModel, connection);
  }
}
