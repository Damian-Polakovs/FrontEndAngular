import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop()
  student_id: string;

  @Prop()
  student_name: string;

  @Prop()
  class: string;

  @Prop()
  date: Date;

  @Prop()
  status: string;

  @Prop()
  comments: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task); 