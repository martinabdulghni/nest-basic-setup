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
import { OrderStatus } from 'libs/types/status';

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
      let order = {
        userId: user._id.toString(),
        items: request.items,
        status: OrderStatus.Open,
        date: new Date(),
        isModified: false,
        oldValue: {},
      };

      for (const o of order.items) {
        const itemId = await this.findItemId(o.itemId.toString());
        if (itemId) {
          o.itemId = itemId;
        }
      }

      const createdOrder = await this.orderRepository.create(order, {
        session,
        timestamps: true,
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

  async findItemId(itemId: string) {
    try {
      const item = await this.itemRepository.findOne({
        itemId: itemId,
      });
      return item._id.toString();
    } catch (error) {
      throw new NotFoundException(`item with itemId: ${itemId} does not exist`);
    }
  }
  async getOrder(id: string, user: User) {
    try {
      const order = await this.orderRepository.findOne({
        _id: id,
      });
      if (user.isAdmin || order.userId === user._id.toString()) return order;
      throw new ForbiddenException();
    } catch (error) {
      throw new NotFoundException(`No order with id: ${id} found`);
    }
  }
  async modifyOrder(id: string, user: User, request: CreateOrderRequest) {
    try {
      const orderToModify = await this.orderRepository.findOne({
        _id: id,
      });
      if (user.isAdmin || orderToModify.userId === user._id.toString()) {
        const order = await this.orderRepository.findOneAndUpdate(
          {
            _id: id,
          },
          {
            $currentDate: {
              date: true,
            },
            $set: {
              ...request,
              oldValue: orderToModify,
              isModified: true,
            },
          },
        );
        return order;
      }
      throw new ForbiddenException();
    } catch (error) {
      throw new NotFoundException(`No order with id: ${id} found`);
    }
  }
  async getUserOrders(user: User) {
    try {
      const orders = await this.orderRepository.find({
        userId: user._id.toString(),
      });
      if (orders) {
        if (user._id.toString() === orders[0].userId) return orders;
        throw new ForbiddenException();
      }
      throw new NotFoundException();
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
