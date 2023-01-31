import { Injectable, Logger } from '@nestjs/common';
import { BillingRepository } from './billing.repository';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  constructor(private readonly billingRepository: BillingRepository){}
  async bill(data: any) {
    const billingItem = { userId: data.user._id, orderId: data.orderId };
    const session = await this.billingRepository.startTransaction();
    try {
      const order = await this.billingRepository.create(billingItem, {
        session,
      });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }
}
