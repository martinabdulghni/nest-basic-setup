import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';
import { BILLING_SERVICE } from './constans/services';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly orderRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}
  async createOrder(request: CreateOrderRequest, authentication: string) {
    this.logger.log(request.orders);
    const session = await this.orderRepository.startTransaction();
    try {
      const order = { orders: request.orders };
      const createdOrder = await this.orderRepository.create(order, {
        session,
      });
      // Fires billing event
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          Authentication: authentication,
          orderId: createdOrder._id,
        }),
      );

      await session.commitTransaction();
      return createdOrder;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async getOrders() {
    console.log(this.orderRepository.find({}));

    return this.orderRepository.find({});
  }
}
