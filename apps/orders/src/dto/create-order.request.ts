import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { OrderStatus } from 'libs/types/status';
import { ObjectId } from 'mongoose';

export class CreateOrderRequest {
  @IsArray()
  items: CreateOrderObjectRequest[];
}
export class CreateOrderObjectRequest {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  status: OrderStatus;
}
