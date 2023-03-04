import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateJobRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  seconds: string;
}
