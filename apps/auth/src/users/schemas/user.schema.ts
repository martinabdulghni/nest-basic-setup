import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { UserStatus } from 'libs/types/status';

@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  isAdmin: boolean;

  @Prop({ type: String })
  status: UserStatus;

  @Prop()
  lastLoggedIn: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
