import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTimeDurationUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateTimeDurationUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}