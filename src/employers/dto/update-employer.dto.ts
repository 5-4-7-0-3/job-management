import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  ArrayUnique 
} from 'class-validator';
import { EmployerStatus } from '../../enums/enums';

export class UpdateEmployerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(EmployerStatus)
  @IsOptional()
  status?: EmployerStatus;

  @IsArray()
  @ArrayUnique({ message: 'Jobs should be unique' })
  @IsString({ each: true })
  @IsOptional()
  jobs?: string[];

  @IsArray()
  @ArrayUnique({ message: 'Workers should be unique' })
  @IsString({ each: true })
  @IsOptional()
  workers?: string[];
}
