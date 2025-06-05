import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDesignationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateDesignationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}