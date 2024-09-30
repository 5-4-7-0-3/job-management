import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WorkerHistoryEvent } from '../enums/enums';


@Schema({ timestamps: true })
export class Worker extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  salary: number;

  @Prop({ type: Types.ObjectId, ref: 'Employer', required: true })
  owner: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Job' })
  job: Types.ObjectId;

  @Prop({
    type: [
      {
        event: { type: String, enum: WorkerHistoryEvent },
        date: { type: Date, default: Date.now },
        job: { type: Types.ObjectId, ref: 'Job' },
      },
    ],
    default: [],
  }) // Hiring history
  history: { event: WorkerHistoryEvent; date: Date; job: Types.ObjectId }[];

  @Prop({ default: null })
  deleted_at: Date | null;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
