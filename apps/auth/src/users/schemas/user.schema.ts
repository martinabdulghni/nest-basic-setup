import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { UserAccountStatusType, UserConnectionStatus, UserRoleType } from 'libs/types/user-status';
import { CreateUserRequest } from '../dto/create-user.request';
import { OrderItemArray, OrderItemObject } from 'apps/orders/src/dto/create-order.request';
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

  @Prop()
  userOrders: OrderItemArray[];
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

  @Prop()
  userOrders: OrderItemArray[];

  @Prop({ type: Array })
  userAccountStatus: Partial<UserAccountStatusType>;
}


export const UserSchema = SchemaFactory.createForClass(User);
