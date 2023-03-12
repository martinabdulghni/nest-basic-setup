import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProjectType } from 'libs/types/project';
import { OrderStatus } from 'libs/types/todo-status';

@Schema({ versionKey: false })
export class Project extends AbstractDocument {
  @Prop({ type: String })
  name: string;
  @Prop({ type: String })
  address: string;
  @Prop({ type: String })
  address2: string;
  @Prop({ type: String })
  postNum: string;
  @Prop({ type: String })
  city: string;
  @Prop({ type: String })
  email: string;
  @Prop({ type: String })
  phoneNum: string;
  @Prop({ type: String })
  momsRegNum: string;
  @Prop({ type: String })
  type: ProjectType;
  @Prop({ type: Date })
  date: Date;
}

export const projectSchema = SchemaFactory.createForClass(Project);
