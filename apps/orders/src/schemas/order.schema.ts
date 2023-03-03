import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus } from 'libs/types/todo-status';
import { CreateOrderObject, OrderItemObject } from '../dto/create-order.request';

@Schema({ versionKey: false })
export class Order extends AbstractDocument {
  @Prop()
  userId: string;

  @Prop()
  items: OrderItemObject[];

  @Prop({ type: String })
  status: OrderStatus;

  @Prop()
  date: Date;

  @Prop({ type: Boolean })
  isModified: boolean;

  @Prop({ type: Object })
  oldValue: {};
}

export const orderSchema = SchemaFactory.createForClass(Order);
