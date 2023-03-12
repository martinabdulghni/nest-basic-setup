import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class JobQueue extends AbstractDocument {
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  desc: string;
  @Prop({ type: Boolean })
  isActive: boolean;
  @Prop({ type: Array<String> })
  allocatedEmployees: string[];
  @Prop({ type: String })
  addedBy: string;
  @Prop({ type: String })
  customer: string;
  @Prop({ type: String })
  project: string;
  @Prop({ type: Number })
  estimatedTime: number;
  @Prop({ type: Number })
  estimatedPrice: number;
  @Prop({ type: Date })
  estimatedDate: Date;
  @Prop({ type: Date })
  addedDate: Date;
  @Prop({ type: String })
  allocatedOrder: String;
}

export const jobQueueSchema = SchemaFactory.createForClass(JobQueue);
