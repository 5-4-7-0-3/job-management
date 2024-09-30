import {
  IsString,
  IsNumber,
  IsOptional,
  IsMongoId,
  ArrayUnique,
  IsArray,
} from 'class-validator';

export class UpdateWorkerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsMongoId({ message: 'Job ID must be a valid MongoID' })
  job?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique({ message: 'Workers should be unique' })
  @IsMongoId({ each: true, message: 'Each worker ID must be a valid MongoID' })
  workers?: string[];
}
