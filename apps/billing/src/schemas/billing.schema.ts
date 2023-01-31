import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Billing extends AbstractDocument {
  @Prop({ type: String })
  userId: string;

  @Prop({ type: String })
  orderId: string;
}

export const billingSchema = SchemaFactory.createForClass(Billing);
