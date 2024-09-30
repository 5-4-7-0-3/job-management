import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employer } from './employer.model';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';

@Injectable()
export class EmployerService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<Employer>,
  ) {}

  async create(createEmployerDto: CreateEmployerDto): Promise<Employer> {
    const jobs = createEmployerDto.jobs.map((id) => new Types.ObjectId(id));
    const workers = createEmployerDto.workers.map(
      (id) => new Types.ObjectId(id),
    );

    const employer = new this.employerModel({
      ...createEmployerDto,
      jobs,
      workers,
    });
    return employer.save();
  }

  async findAll(): Promise<Employer[]> {
    return this.employerModel
      .find({ deleted_at: null })
      .populate({ path: 'jobs', model: 'Job' })
      .populate({ path: 'workers', model: 'Worker' })
      .exec();
  }

  async findOne(id: string): Promise<Employer> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Employer not found');
    }
    const employer = await this.employerModel
      .findOne({ _id: id, deleted_at: null })
      .populate({ path: 'jobs', model: 'Job' })
      .populate({ path: 'workers', model: 'Worker', select: 'name' })
      .exec();
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }

    return employer;
  }

  async update(
    id: string,
    updateEmployerDto: UpdateEmployerDto,
  ): Promise<Employer> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Employer not found');
    }

    const updatedEmployer = await this.employerModel
      .findOneAndUpdate({ _id: id, deleted_at: null }, updateEmployerDto, {
        new: true,
      })
      .populate({ path: 'jobs', model: 'Job' })
      .populate({ path: 'workers', model: 'Worker' })
      .exec();

    if (!updatedEmployer) {
      throw new NotFoundException('Employer not found');
    }

    return updatedEmployer;
  }

  async softDelete(id: string): Promise<Employer> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Employer not found');
    }

    const deletedEmployer = await this.employerModel
      .findOneAndUpdate(
        { _id: id, deleted_at: null },
        { deleted_at: new Date() },
        { new: true },
      )
      .exec();

    if (!deletedEmployer) {
      throw new NotFoundException('Employer not found');
    }

    return deletedEmployer;
  }

  async findWorkers(id: string): Promise<Object[]> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Employer not found');
    }

    const employer = await this.employerModel
      .findOne({ _id: id, deleted_at: null })
      .populate({ path: 'workers', model: 'Worker', select: 'name' })
      .exec();

    if (!employer) {
      throw new NotFoundException('Employer not found');
    }

    return employer.workers;
  }
}
