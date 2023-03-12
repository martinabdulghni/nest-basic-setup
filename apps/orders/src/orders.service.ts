import { BadRequestException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderObject, OrderItemArray } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';
import { BILLING_SERVICE, JOB_SERVICE, MAIL_SERVICE } from './constans/services';
import { lastValueFrom } from 'rxjs';
import { User } from 'apps/auth/src/users/schemas/user.schema';
import { ClientSession } from 'mongoose';
import { OrderStatus } from 'libs/types/todo-status';
import { Request } from 'express';
import { Order } from './schemas/order.schema';
import { ItemRepository } from 'apps/items/src/items.repository';
import { Items } from 'apps/items/src/schemas/items.schema';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrdersRepository,
    private readonly itemRepository: ItemRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
    @Inject(MAIL_SERVICE) private mailClient: ClientProxy,
    @Inject(JOB_SERVICE) private jobClient: ClientProxy,
  ) {}

  async createOrder(body: OrderItemArray, user: User, req: Request) {
    const token = req.cookies.Authentication;
    const session: ClientSession = await this.orderRepository.startTransaction();
    const order: CreateOrderObject = this.createOrderObject(body, user);

    try {
      const newOrder: Order = await this.orderRepository.create(order, {
        session,
        timestamps: true,
      });

      try {
        let itemsArray = [];
        for (const item of newOrder.items) {
          const getItem = await this.itemRepository.findOne({ _id: item.itemId });
          let { _id, history, modifiedDate, isModified, isPublished, quantity, addedDate, addedBy, ...ITEM } = getItem;
          itemsArray.push(ITEM);
        }

        newOrder.items = itemsArray;
        //* MAIL SERVICE:
        await this.callMailService(token, newOrder);

        //* JOB SERVICE:
        await this.callJobService(token, newOrder);
      } catch (error) {
        throw new NotFoundException('item not found.');
      }

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
  private async callBillingService(authentication: string, orderId: string) {
    await lastValueFrom(
      this.billingClient.emit('order_created', {
        Authentication: authentication,
        orderId: orderId,
      }),
    );
  }
  private async callMailService(authentication: string, order: Order) {
    return await lastValueFrom(
      this.mailClient.emit('create_mail', {
        Authentication: authentication,
        order: order,
      }),
    );
  }
  private async callJobService(authentication: string, order: Order) {
    return await lastValueFrom(
      this.jobClient.emit('create_job_queue', {
        Authentication: authentication,
        order: order,
      }),
    );
  }
}
