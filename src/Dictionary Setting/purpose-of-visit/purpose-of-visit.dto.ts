import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePurposeOfVisitDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdatePurposeOfVisitDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}