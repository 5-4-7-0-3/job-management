import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EmployerStatus } from '../enums/enums';

@Schema({ timestamps: true })
export class Employer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: EmployerStatus })
  status: EmployerStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Job' }], default: [] })
  jobs: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Worker' }], default: [] })
  workers: Types.ObjectId[];

  @Prop({ default: null })
  deleted_at: Date | null;
}

export const EmployerSchema = SchemaFactory.createForClass(Employer);
