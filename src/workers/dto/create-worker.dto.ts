import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class CreateWorkerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @IsOptional()
  @IsMongoId({ message: 'Owner ID must be a valid MongoID' })
  owner?: string;

  @IsOptional()
  @IsMongoId({ message: 'Job ID must be a valid MongoID' })
  job?: string;
}
