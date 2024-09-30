import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from './job.model';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createJobDto: CreateJobDto): Promise<Job> {
    return this.jobService.create(createJobDto);
  }

  @Get()
  async findAll(): Promise<Job[]> {
    return this.jobService.findAll();
  }

  @Get('date-period')
  async findByDatePeriod(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Job[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.jobService.findByDatePeriod(start, end);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Job> {
    const job = await this.jobService.findOne(id);
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    return job;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
  ): Promise<Job> {
    const updatedJob = await this.jobService.update(id, updateJobDto);
    if (!updatedJob) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    return updatedJob;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Job> {
    const deletedJob = await this.jobService.softDelete(id);
    if (!deletedJob) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    return deletedJob;
  }

  @Put(':id/archive')
  async archive(@Param('id') id: string): Promise<Job> {
    const archivedJob = await this.jobService.archive(id);
    if (!archivedJob) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    return archivedJob;
  }
}
