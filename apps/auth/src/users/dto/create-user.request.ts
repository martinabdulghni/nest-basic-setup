import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserConnectionStatus, UserAccountStatusType, UserRoleType } from 'libs/types/user-status';

export class CreateUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  name: string;
}

export class ModifyUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  password: string;

  name: string;

  userConnectionStatus: UserConnectionStatus;

  userAccountStatus: Partial<UserAccountStatusType>;

  lastLoggedIn: Date;

  image: string;

  desc: string;

  addedDate: Date;

  userRole: Partial<UserRoleType>;
}
export class ModifyProfileRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  password: string;

  name: string;

  image: string;

  desc: string;
  userConnectionStatus: UserConnectionStatus;
}

