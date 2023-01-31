import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

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
  description: string;

  @IsPositive()
  price: number;

  @IsPositive()
  quantity: number;

}
