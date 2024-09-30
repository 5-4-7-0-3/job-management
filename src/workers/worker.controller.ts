import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WorkerService } from './worker.service';
import { Worker } from './worker.model';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { WorkerOperation } from '../enums/enums';
import { Job } from 'src/jobs/job.model';

@Controller('workers')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createWorkerDto: CreateWorkerDto): Promise<Worker> {
    return this.workerService.create(createWorkerDto);
  }

  @Get()
  async findAll(): Promise<Worker[]> {
    return this.workerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Worker> {
    const worker = await this.workerService.findOne(id);
    if (!worker) {
      throw new HttpException('Worker not found', HttpStatus.NOT_FOUND);
    }
    return worker;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateWorkerDto: UpdateWorkerDto,
  ): Promise<Worker> {
    const updatedWorker = await this.workerService.update(id, updateWorkerDto);
    if (!updatedWorker) {
      throw new HttpException('Worker not found', HttpStatus.NOT_FOUND);
    }
    return updatedWorker;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Worker> {
    const deletedWorker = await this.workerService.softDelete(id);
    if (!deletedWorker) {
      throw new HttpException('Worker not found', HttpStatus.NOT_FOUND);
    }
    return deletedWorker;
  }

  @Get(':id/matched-jobs')
  async getMatchedJobs(@Param('id') id: string): Promise<Job[]> {
    return this.workerService.findMatchedJobs(id);
  }

  @Put(':id/new-employer')
  async changeEmployer(
    @Param('id') id: string,
    @Body()
    changeEmployerDto: { employerId: string; operation: WorkerOperation },
  ): Promise<Worker> {
    const updatedWorker = await this.workerService.changeEmployer(
      id,
      changeEmployerDto,
    );
    if (!updatedWorker) {
      throw new HttpException('Worker not found', HttpStatus.NOT_FOUND);
    }
    return updatedWorker;
  }
}
