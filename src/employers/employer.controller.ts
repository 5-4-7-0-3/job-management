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
import { EmployerService } from './employer.service';
import { Employer } from './employer.model';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';

@Controller('employers')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(
    @Body() createEmployerDto: CreateEmployerDto,
  ): Promise<Employer> {
    return this.employerService.create(createEmployerDto);
  }

  @Get()
  async findAll(): Promise<Employer[]> {
    return this.employerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Employer> {
    const employer = await this.employerService.findOne(id);
    if (!employer) {
      throw new HttpException('Employer not found', HttpStatus.NOT_FOUND);
    }
    return employer;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateEmployerDto: UpdateEmployerDto,
  ): Promise<Employer> {
    const updatedEmployer = await this.employerService.update(
      id,
      updateEmployerDto,
    );
    if (!updatedEmployer) {
      throw new HttpException('Employer not found', HttpStatus.NOT_FOUND);
    }
    return updatedEmployer;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Employer> {
    const deletedEmployer = await this.employerService.softDelete(id);
    if (!deletedEmployer) {
      throw new HttpException('Employer not found', HttpStatus.NOT_FOUND);
    }
    return deletedEmployer;
  }

  @Get(':id/workers')
  async getWorkers(@Param('id') id: string): Promise<Object[]> {
    const workers = await this.employerService.findWorkers(id);
    if (!workers) {
      throw new HttpException('Employer not found', HttpStatus.NOT_FOUND);
    }
    return workers;
  }
}
