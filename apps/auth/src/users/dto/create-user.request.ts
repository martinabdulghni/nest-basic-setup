import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserStatus } from 'libs/types/status';

export class CreateUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  isAdmin: boolean;

  status: UserStatus;

  lastLoggedIn: boolean;
}
