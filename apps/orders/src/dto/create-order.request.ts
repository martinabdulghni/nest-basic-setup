import { IsArray, IsDate, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { OrderStatus } from 'libs/types/user-status';

export class OrderItemArray {
  @IsArray()
  items: OrderItemObject[];
}
export class OrderItemObject {
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

export class CreateOrderObject {
  userId: string;
  items: OrderItemObject[];
  status: OrderStatus;
  date: Date;
  isModified: boolean;
  oldValue: Object;
}
