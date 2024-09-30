import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { JobStatus } from '../enums/enums';

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: JobStatus })
  status: JobStatus;

  @Prop({ required: true })
  salary: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Worker' }], default: [] })
  workers: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Employer', required: true })
  owner: Types.ObjectId;

  @Prop({ default: null })
  deleted_at: Date | null;
}

export const JobSchema = SchemaFactory.createForClass(Job);
