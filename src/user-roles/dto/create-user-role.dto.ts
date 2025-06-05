import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class PermissionDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsBoolean()
  IsRead?: boolean;

  @IsOptional()
  @IsBoolean()
  IsCreate?: boolean;

  @IsOptional()
  @IsBoolean()
  IsUpdate?: boolean;

  @IsOptional()
  @IsBoolean()
  IsDelete?: boolean;

  @IsOptional()
  @IsBoolean()
  IsExecute?: boolean;
}

export class CreateUserRoleDto {
  @IsString()
  @IsNotEmpty()
  UserRoleName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}