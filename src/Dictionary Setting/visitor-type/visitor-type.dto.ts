import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVisitorTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateVisitorTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}