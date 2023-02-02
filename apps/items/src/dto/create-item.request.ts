import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateItemRequest {
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
