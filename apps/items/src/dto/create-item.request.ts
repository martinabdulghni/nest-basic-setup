import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

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

  @IsString()
  image: string;

  @IsNotEmpty()
  @IsBoolean()
  isPublished: boolean;
}
