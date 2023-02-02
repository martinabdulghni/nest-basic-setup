import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Items extends AbstractDocument {
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: Number })
  price: number;
  @Prop({ type: Number })
  quantity: number;
}

export const itemsSchema = SchemaFactory.createForClass(Items);
