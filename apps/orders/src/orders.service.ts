import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';
import { BILLING_SERVICE } from './constans/services';
import { lastValueFrom } from 'rxjs';
import { ItemRepository } from 'apps/items/src/items.repository';
import { User } from 'apps/auth/src/users/schemas/user.schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    private readonly orderRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
    private readonly itemRepository: ItemRepository,
  ) {}

  //! @POST
  async createOrder(
    request: CreateOrderRequest,
    authentication: string,
    user: User,
  ) {
    const session = await this.orderRepository.startTransaction();
    try {
      let order = { userId: user._id.toString(), orders: request.orders };
      // If item found -> return its id.
      for (const o of order.orders) {
        const itemId = await this.findItemId(o.name);
        o.itemId = itemId.toString();
      }

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

  async findItemId(name: string) {
    try {
      const item = await this.itemRepository.findOne({
        name: name,
      });
      return item._id;
    } catch (error) {
      throw new NotFoundException(`item with name: ${name} does not exist`);
    }
  }

  //! @GET
  // async getOrder(id: string, user: User) {
  //   try {
  //     const order = await this.orderRepository.findOne({
  //       _id: id,
  //     });
  //     if (user.isAdmin || order.userId === user._id.toString()) return order;
  //     throw new ForbiddenException();
  //   } catch (error) {
  //     throw new NotFoundException(`No item with id: ${id} found`);
  //   }
  // }
  async getUserOrders(user: User) {
    try {
      const orders = await this.orderRepository.find({
        userId: user._id.toString(),
      });
      if (orders) {
        console.log(orders);

        if (user._id.toString() === orders[0].userId) return orders;
        throw new ForbiddenException();
      }
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getOrders(user: User) {
    if (user.isAdmin) {
      return this.orderRepository.find({});
    }
    throw new ForbiddenException();
  }
}
