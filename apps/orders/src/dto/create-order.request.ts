import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateOrderRequest {
  @IsArray()
  orders: CreateOrderObjectRequest[];
}
export class CreateOrderObjectRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsPositive()
  quantity: number;
}
