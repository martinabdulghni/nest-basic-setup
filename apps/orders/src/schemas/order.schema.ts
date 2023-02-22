import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus } from 'libs/types/status';
import { CreateOrderObjectRequest } from '../dto/create-order.request';

@Schema({ versionKey: false })
export class Order extends AbstractDocument {
  @Prop()
  items: CreateOrderObjectRequest[];
  @Prop()
  userId: string;
  @Prop()
  date: Date;
  @Prop({ type: String })
  status: OrderStatus;
  @Prop({ type: Boolean })
  isModified: boolean;
  @Prop({ type: Object })
  oldValue: {};
}

export const orderSchema = SchemaFactory.createForClass(Order);
