import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class pagination {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit: number;
}