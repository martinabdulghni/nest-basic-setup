import { BadRequestException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderObject, OrderItemArray } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';
import { BILLING_SERVICE } from './constans/services';
import { lastValueFrom } from 'rxjs';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { OrderStatus } from 'libs/types/user-status';
import { ClientSession } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(private readonly orderRepository: OrdersRepository, @Inject(BILLING_SERVICE) private billingClient: ClientProxy) {}

  async createOrder(body: OrderItemArray, user: User, authentication: string) {
    const session: ClientSession = await this.orderRepository.startTransaction();
    const order: CreateOrderObject = this.createOrderObject(body, user);

    console.log(order);

    try {
      await this.orderRepository.create(order, {
        session,
        timestamps: true,
      });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async getOrder(id: string) {
    try {
      return await this.orderRepository.findOne({
        _id: id,
      });
    } catch (error) {
      throw new NotFoundException(`No order with id: ${id} found`);
    }
  }
  async modifyOrder(id: string, body: OrderItemArray) {
    try {
      const orderToModify = await this.orderRepository.findOne({
        _id: id,
      });
      return await this.orderRepository.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $currentDate: {
            date: true,
          },
          $set: {
            ...body,
            oldValue: orderToModify,
            isModified: true,
          },
        },
      );
    } catch (error) {
      throw new NotFoundException(`No order with id: ${id} found`);
    }
  }

  async getOrders() {
    try {
      return await this.orderRepository.find({});
    } catch (error) {
      throw new NotFoundException('No orders found');
    }
  }

  private createOrderObject(body: OrderItemArray, user: User): CreateOrderObject {
    return {
      userId: user._id.toString(),
      items: body.items,
      status: OrderStatus.New,
      date: new Date(),
      isModified: false,
      oldValue: {},
    };
  }

  async deleteOrder(id: string) {
    try {
      await this.orderRepository.findOne({
        _id: id,
      });
      await this.orderRepository.findOneAndDelete({
        _id: id,
      });
      return HttpStatus.OK;
    } catch (error) {
      throw new BadRequestException('Couldnt find order');
    }
  }

  //TODO: When order status is "pending" -> send to billing.
  private async insertToBilling(authentication: string, orderId: string) {
    await lastValueFrom(
      this.billingClient.emit('order_created', {
        Authentication: authentication,
        orderId: orderId,
      }),
    );
  }
}
