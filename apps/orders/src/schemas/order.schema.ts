import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateOrderObjectRequest } from '../dto/create-order.request';

@Schema({ versionKey: false })
export class Order extends AbstractDocument {
  @Prop()
  orders: CreateOrderObjectRequest[];


  // @Prop()
  // name: string;

  // @Prop()
  // price: number;

  // @Prop()
  // phoneNumber: string;
}

export const orderSchema = SchemaFactory.createForClass(Order);
