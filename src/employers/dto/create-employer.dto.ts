import { 
  IsString, 
  IsNotEmpty, 
  IsArray, 
  IsEnum, 
  ArrayNotEmpty, 
  ArrayUnique 
} from 'class-validator';
import { EmployerStatus } from '../../enums/enums';

export class CreateEmployerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(EmployerStatus)
  status: EmployerStatus;

  @IsArray()
  @ArrayUnique({ message: 'Jobs should be unique' })
  @IsString({ each: true })
  jobs: string[];

  @IsArray()
  @ArrayUnique({ message: 'Workers should be unique' })
  @IsString({ each: true })
  workers: string[];
}
