import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { UserRole } from './user-role.entity';
import { Permission } from './entities/permission.entity';
import { UserRolePermission } from './entities/user-role-permission.entity';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(UserRolePermission)
    private userRolePermissionRepository: Repository<UserRolePermission>,
  ) {
    this.seedPermissions().catch(error => console.error('Seeding failed:', error));
  }

  private async seedPermissions() {
    try {
      const initialPermissions = [
        {
          permissionName: 'Dashboard',
          isMaster: true,
          isReadDisplay: true,
          isCreateDisplay: true,
          isUpdateDisplay: true,
          isDeleteDisplay: true,
          isExecuteDisplay: true,
        },
        {
          permissionName: 'PreApprovalEntry',
          isMaster: true,
          isReadDisplay: true,
          isCreateDisplay: true,
          isUpdateDisplay: true,
          isDeleteDisplay: true,
          isExecuteDisplay: true,
        },
        {
          permissionName: 'SpotEntry',
          isMaster: true,
          isReadDisplay: true,
          isCreateDisplay: true,
          isUpdateDisplay: true,
          isDeleteDisplay: true,
          isExecuteDisplay: true,
        },
        {
          permissionName: 'UserManagement',
          isMaster: true,
          isReadDisplay: true,
          isCreateDisplay: true,
          isUpdateDisplay: true,
          isDeleteDisplay: true,
          isExecuteDisplay: true,
        },
        {
          permissionName: 'UserRole',
          isMaster: true,
          isReadDisplay: true,
          isCreateDisplay: true,
          isUpdateDisplay: true,
          isDeleteDisplay: true,
          isExecuteDisplay: true,
        },
        {
          permissionName: 'Dictionarysettings',
          isMaster: true,
          isReadDisplay: true,
          isCreateDisplay: true,
          isUpdateDisplay: true,
          isDeleteDisplay: true,
          isExecuteDisplay: true,
        },
        {
          permissionName: 'Approvedpasses',
          isMaster: true,
          isReadDisplay: true,
          isCreateDisplay: true,
          isUpdateDisplay: true,
          isDeleteDisplay: true,
          isExecuteDisplay: true,
        },
        {
          permissionName: 'Disapprovedpasses',
          isMaster: true,
          isReadDisplay: true,
          isCreateDisplay: true,
          isUpdateDisplay: true,
          isDeleteDisplay: true,
          isExecuteDisplay: true,
        },
        {
          permissionName: 'Totalexitpasses',
          isMaster: true,
          isReadDisplay: true,
          isCreateDisplay: true,
          isUpdateDisplay: true,
          isDeleteDisplay: true,
          isExecuteDisplay: true,
        },
        
        {
          permissionName: 'AllRecords',
          isMaster: true,
          isReadDisplay: true,
          isCreateDisplay: true,
          isUpdateDisplay: true,
          isDeleteDisplay: true,
          isExecuteDisplay: true,
        },
        
      ];

      for (const perm of initialPermissions) {
        const existingPerm = await this.permissionRepository.findOne({ where: { permissionName: perm.permissionName } });
        if (!existingPerm) {
          await this.permissionRepository.save(perm);
          console.log(`Seeded permission: ${perm.permissionName}`);
        } else {
          await this.permissionRepository.update(
            { permissionName: perm.permissionName },
            {
              isMaster: perm.isMaster,
              isReadDisplay: perm.isReadDisplay,
              isCreateDisplay: perm.isCreateDisplay,
              isUpdateDisplay: perm.isUpdateDisplay,
              isDeleteDisplay: perm.isDeleteDisplay,
              isExecuteDisplay: perm.isExecuteDisplay,
            }
          );
          console.log(`Updated permission: ${perm.permissionName}`);
        }
      }

      const finalCount = await this.permissionRepository.count();
      console.log(`Total permissions in database after seeding: ${finalCount}`);
    } catch (error) {
      console.error('Error seeding permissions:', error);
      throw new BadRequestException('Failed to seed permissions');
    }
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    try {
      const skip = (page - 1) * limit;
      const where = search ? { userRoleName: Like(`%${search}%`) } : {};
      const [roles, total] = await this.userRoleRepository.findAndCount({
        where,
        relations: ["permissions", "permissions.permission"],
        skip,
        take: limit,
      });
      return {
        roles,
        total,
        start: skip + 1,
        end: Math.min(skip + roles.length, total),
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch user roles: ${error.message}`);
    }
  }

  async findAllActive() {
    try {
      return await this.userRoleRepository.find({
        where: { active: true },
        relations: ["permissions", "permissions.permission"],
      });
    } catch (error) {
      throw new BadRequestException(`Failed to fetch active user roles: ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      const userRole = await this.userRoleRepository.findOne({
        where: { id },
        relations: ["permissions", "permissions.permission"],
      });
      if (!userRole) {
        throw new NotFoundException(`User role with ID ${id} not found`);
      }
      return userRole;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch user role: ${error.message}`);
    }
  }

  async create(createUserRoleDto: CreateUserRoleDto) {
    try {
      const permissionIds = createUserRoleDto.permissions.map(p => p.id);
      const existingPermissions = await this.permissionRepository.findByIds(permissionIds);
      if (existingPermissions.length !== permissionIds.length) {
        throw new BadRequestException('One or more permission IDs are invalid');
      }

      const userRole = this.userRoleRepository.create({
        userRoleName: createUserRoleDto.UserRoleName,
        active: true,
      });

      const savedUserRole = await this.userRoleRepository.save(userRole);

      const permissions = createUserRoleDto.permissions.map(perm => ({
        userRoleId: savedUserRole.id,
        permissionId: perm.id,
        isRead: perm.IsRead || false,
        isCreate: perm.IsCreate || false,
        isUpdate: perm.IsUpdate || false,
        isDelete: perm.IsDelete || false,
        isExecute: perm.IsExecute || false,
      }));

      await this.userRolePermissionRepository.save(permissions);
      return await this.findOne(savedUserRole.id);
    } catch (error) {
      throw new BadRequestException(`Failed to create user role: ${error.message}`);
    }
  }

  async update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    try {
      const existingRole = await this.findOne(id);

      const permissionIds = updateUserRoleDto.permissions.map(p => p.id);
      const existingPermissions = await this.permissionRepository.findByIds(permissionIds);
      if (existingPermissions.length !== permissionIds.length) {
        throw new BadRequestException('One or more permission IDs are invalid');
      }

      await this.userRoleRepository.update(id, {
        userRoleName: updateUserRoleDto.UserRoleName,
        active: updateUserRoleDto.Active,
      });

      await this.userRolePermissionRepository.delete({ userRoleId: id });
      const permissions = updateUserRoleDto.permissions.map(perm => ({
        userRoleId: id,
        permissionId: perm.id,
        isRead: perm.IsRead || false,
        isCreate: perm.IsCreate || false,
        isUpdate: perm.IsUpdate || false,
        isDelete: perm.IsDelete || false,
        isExecute: perm.IsExecute || false,
      }));

      await this.userRolePermissionRepository.save(permissions);
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException(`Failed to update user role: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const existingRole = await this.findOne(id);
      await this.userRolePermissionRepository.delete({ userRoleId: id });
      await this.userRoleRepository.delete(id);
      return { message: 'User role deleted successfully' };
    } catch (error) {
      throw new BadRequestException(`Failed to delete user role: ${error.message}`);
    }
  }

  async getAllPermissions() {
    try {
      const permissions = await this.permissionRepository.find();
      console.log('Permissions fetched from database:', permissions);
      if (!permissions.length) {
        throw new NotFoundException('No permissions found');
      }
      return permissions;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch permissions: ${error.message}`);
    }
  }
}