import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGenderDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateGenderDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}