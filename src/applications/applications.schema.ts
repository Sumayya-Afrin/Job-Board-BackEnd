/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema()
export class Application {
  @Prop({ required: true })
  jobId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  coverLetter: string;

  @Prop({ required: true, default: 'applied' })
  status: string; // 'applied', 'reviewed', 'accepted', 'rejected'
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
