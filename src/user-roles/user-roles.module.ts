// src/user-roles/user-roles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolesService } from './user-roles.service';
import { UserRolesController } from './user-roles.controller';
import { UserRole } from './user-role.entity';
import { Permission } from './entities/permission.entity';
import { UserRolePermission } from './entities/user-role-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRole, Permission, UserRolePermission]),
  ],
  controllers: [UserRolesController],
  providers: [UserRolesService],
})
export class UserRolesModule {}