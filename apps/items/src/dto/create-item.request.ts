import { IsBoolean, IsDate, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateItemRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  desc: string;

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

export class CreateItemObject {
  name: string;
  desc: string;
  price: number;
  quantity: number;
  image: string;
  isPublished: boolean;
  addedDate: Date;
  addedBy: string;
  isModified: boolean;
  history: [];
  modifiedDate: Date;
}
