import { 
  IsString, 
  IsNumber, 
  IsEnum, 
  IsOptional, 
  IsMongoId,
  ArrayUnique,
  IsArray 
} from 'class-validator';
import { JobStatus } from '../../enums/enums';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique({ message: 'Workers should be unique' })
  @IsMongoId({ each: true, message: 'Each worker ID must be a valid MongoID' })
  workers?: string[];
}
