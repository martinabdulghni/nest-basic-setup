import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { UserAccountStatusType, UserConnectionStatus } from 'libs/types/user-status';
import { CreateUserRequest } from '../dto/create-user.request';
import { UserRoleType } from 'libs/types/roles';
interface modifyHistory {
  modified: CreateUserRequest;
  modifiedDate: Date;
}
@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: String })
  userConnectionStatus: UserConnectionStatus;

  @Prop({ type: Array })
  userAccountStatus: Partial<UserAccountStatusType>;

  @Prop()
  lastLoggedIn: Date;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Date })
  addedDate: Date;

  @Prop({ type: Array })
  userRole: Partial<UserRoleType>;

  @Prop({ type: Array })
  history: modifyHistory[];
}

export class UserBasic extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: String })
  userConnectionStatus: UserConnectionStatus;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Date })
  addedDate: Date;

  @Prop({ type: Array })
  userRole: Partial<UserRoleType>;
}


export const UserSchema = SchemaFactory.createForClass(User);
