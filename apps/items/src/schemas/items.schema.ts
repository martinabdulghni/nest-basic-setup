import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateItemRequest } from '../dto/create-item.request';

interface modifyHistory {
  modified: CreateItemRequest;
  modifiedDate: Date;
}
@Schema({ versionKey: false })
export class Items extends AbstractDocument {
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  desc: string;
  @Prop({ type: Number })
  price: number;
  @Prop({ type: Number })
  quantity: number;
  @Prop({ type: String })
  image: string;
  @Prop({ type: Date })
  addedDate: Date;
  @Prop({ type: String })
  addedBy: string;
  @Prop({ type: Boolean })
  isPublished: boolean;
  @Prop({ type: Boolean })
  isModified: boolean;
  @Prop({ type: Array })
  history: modifyHistory[];
  @Prop({ type: Date })
  modifiedDate: Date;
}

export const itemsSchema = SchemaFactory.createForClass(Items);
