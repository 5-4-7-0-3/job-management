import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsEnum, 
  IsDateString, 
  IsMongoId,
  ArrayUnique,
  ArrayNotEmpty,
  IsArray 
} from 'class-validator';
import { JobStatus } from '../../enums/enums';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(JobStatus)
  status: JobStatus;

  @IsNotEmpty()
  @IsDateString()
  creationDate: string;

  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @IsNotEmpty()
  @IsMongoId({ each: true, message: 'Each owner ID must be a valid MongoID' })
  owner: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Workers array should not be empty' })
  @ArrayUnique({ message: 'Workers should be unique' })
  @IsMongoId({ each: true, message: 'Each worker ID must be a valid MongoID' })
  workers: string[];
}
