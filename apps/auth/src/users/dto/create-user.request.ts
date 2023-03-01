import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRoleType } from 'libs/types/roles';
import { UserConnectionStatus, UserAccountStatusType } from 'libs/types/user-status';

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

  description: string;

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

  description: string;
  userConnectionStatus: UserConnectionStatus;
}

