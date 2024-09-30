import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Worker } from './worker.model';
import { Job } from '../jobs/job.model';
import { JobStatus, WorkerHistoryEvent, WorkerOperation } from '../enums/enums';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';

@Injectable()
export class WorkerService {
  constructor(
    @InjectModel(Worker.name)
    private workerModel: Model<Worker>,
    @InjectModel(Job.name)
    private jobModel: Model<Job>,
  ) {}

  async create(createWorkerDto: CreateWorkerDto): Promise<Worker> {
    const { owner, job, ...rest } = createWorkerDto;

    if (!Types.ObjectId.isValid(owner)) {
      throw new BadRequestException('Invalid owner ID');
    }

    if (job && !Types.ObjectId.isValid(job)) {
      throw new BadRequestException('Invalid job ID');
    }

    const worker = new this.workerModel({
      ...rest,
      owner: new Types.ObjectId(owner),
      job: job ? new Types.ObjectId(job) : null,
    });

    return worker.save();
  }

  async findAll(): Promise<Worker[]> {
    return this.workerModel
      .find({ deleted_at: null })
      .populate({ path: 'owner', select: 'name' })
      .populate('job', 'name')
      .populate({ path: 'history.job', select: 'name' })
      .exec();
  }

  async findOne(id: string): Promise<Worker | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Worker not found');
    }

    const worker = await this.workerModel
      .findOne({ _id: id, deleted_at: null })
      .populate({ path: 'owner', select: 'name' })
      .populate('job', 'name')
      .populate({ path: 'history.job', select: 'name' })
      .exec();

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    return worker;
  }

  async update(
    id: string,
    updateWorkerDto: UpdateWorkerDto,
  ): Promise<Worker | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Worker not found');
    }

    const updateData: any = { ...updateWorkerDto };

    if (updateWorkerDto.job && !Types.ObjectId.isValid(updateWorkerDto.job)) {
      throw new BadRequestException('Invalid job ID');
    }

    if (updateWorkerDto.workers) {
      updateWorkerDto.workers.forEach((workerId) => {
        if (!Types.ObjectId.isValid(workerId)) {
          throw new BadRequestException(`Invalid worker ID: ${workerId}`);
        }
      });
      updateData.workers = updateWorkerDto.workers.map(
        (id) => new Types.ObjectId(id),
      );
    }

    if (updateWorkerDto.job) {
      updateData.job = new Types.ObjectId(updateWorkerDto.job);
    }

    const updatedWorker = await this.workerModel
      .findOneAndUpdate({ _id: id, deleted_at: null }, updateData, {
        new: true,
      })
      .populate({ path: 'owner', select: 'name' })
      .populate('job', 'name')
      .populate({ path: 'history.job', select: 'name' })
      .exec();

    if (!updatedWorker) {
      throw new NotFoundException('Worker not found');
    }

    return updatedWorker;
  }

  async softDelete(id: string): Promise<Worker | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Worker not found');
    }

    const deletedWorker = await this.workerModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { deleted_at: new Date() },
        { new: true },
      )
      .exec();

    if (!deletedWorker) {
      throw new NotFoundException('Worker not found');
    }

    return deletedWorker;
  }

  async findMatchedJobs(id: string): Promise<Job[]> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Worker not found');
    }

    const worker = await this.workerModel
      .findOne({ _id: id, deleted_at: null })
      .exec();

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    return this.jobModel
      .find({
        salary: { $gte: worker.salary },
        status: { $in: [JobStatus.ACTIVE] },
        deleted_at: null,
      })
      .populate({ path: 'owner', select: 'name' })
      .populate({ path: 'workers', model: 'Worker', select: 'name' })
      .exec();
  }

  async changeEmployer(
    id: string,
    changeEmployerDto: { employerId: string; operation: WorkerOperation },
  ): Promise<Worker> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Worker not found');
    }

    if (!Types.ObjectId.isValid(changeEmployerDto.employerId)) {
      throw new BadRequestException('Invalid employer ID');
    }

    const worker = await this.workerModel
      .findOne({ _id: id, deleted_at: null })
      .exec();

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    // Hiring or firing logic
    if (changeEmployerDto.operation === WorkerOperation.HIRE) {
      worker.owner = new Types.ObjectId(changeEmployerDto.employerId);

      // Adding an entry to history
      worker.history.push({
        event: WorkerHistoryEvent.HIRED,
        date: new Date(),
        job: worker.job,
      });
    } else if (changeEmployerDto.operation === WorkerOperation.FIRE) {
      worker.owner = null;

      // Adding an entry to history
      worker.history.push({
        event: WorkerHistoryEvent.FIRED,
        date: new Date(),
        job: worker.job,
      });
    } else {
      throw new BadRequestException('Invalid operation');
    }

    return worker.save();
  }
}
