import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job } from './job.model';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobStatus } from 'src/enums/enums';

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const { owner, workers, creationDate, ...rest } = createJobDto;

    if (!Types.ObjectId.isValid(owner)) {
      throw new BadRequestException('Invalid owner ID');
    }
    workers.forEach((workerId) => {
      if (!Types.ObjectId.isValid(workerId)) {
        throw new BadRequestException(`Invalid worker ID: ${workerId}`);
      }
    });

    const job = new this.jobModel({
      ...rest,
      owner: new Types.ObjectId(owner),
      workers: workers.map((id) => new Types.ObjectId(id)),
      createdAt: new Date(creationDate),
    });

    return job.save();
  }

  async findAll(): Promise<Job[]> {
    return this.jobModel
      .find({ deleted_at: null })
      .populate({ path: 'workers', model: 'Worker', select: 'name' })
      .populate({ path: 'owner', select: 'name' })
      .exec();
  }

  async findOne(id: string): Promise<Job | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Job not found');
    }

    const job = await this.jobModel
      .findOne({ _id: id, deleted_at: null })
      .populate({ path: 'workers', model: 'Worker', select: 'name' })
      .populate({ path: 'owner', select: 'name' })
      .exec();

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Job not found');
    }

    const updateData: any = { ...updateJobDto };

    if (updateJobDto.workers) {
      updateJobDto.workers.forEach((workerId) => {
        if (!Types.ObjectId.isValid(workerId)) {
          throw new BadRequestException(`Invalid worker ID: ${workerId}`);
        }
      });
      updateData.workers = updateJobDto.workers.map(
        (id) => new Types.ObjectId(id),
      );
    }

    const updatedJob = await this.jobModel
      .findOneAndUpdate({ _id: id, deleted_at: null }, updateData, {
        new: true,
      })
      .populate({ path: 'workers', model: 'Worker', select: 'name' })
      .populate({ path: 'owner', select: 'name' })
      .exec();

    if (!updatedJob) {
      throw new NotFoundException('Job not found');
    }

    return updatedJob;
  }

  async softDelete(id: string): Promise<Job | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Job not found');
    }

    const deletedJob = await this.jobModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { deleted_at: new Date() },
        { new: true },
      )
      .exec();

    if (!deletedJob) {
      throw new NotFoundException('Job not found');
    }

    return deletedJob;
  }

  async archive(id: string): Promise<Job | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Job not found');
    }

    const archivedJob = await this.jobModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { status: JobStatus.ARCHIVED },
        { new: true },
      )
      .populate({ path: 'workers', model: 'Worker', select: 'name' })
      .populate({ path: 'owner', select: 'name' })
      .exec();

    if (!archivedJob) {
      throw new NotFoundException('Job not found');
    }

    return archivedJob;
  }

  async findByDatePeriod(startDate: Date, endDate: Date): Promise<Job[]> {
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.jobModel
      .find({
        createdAt: { $gte: startDate, $lte: endDate },
        deleted_at: null,
      })
      .populate({ path: 'workers', model: 'Worker', select: 'name' })
      .populate({ path: 'owner', select: 'name' })
      .exec();
  }
}
