import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserRole } from '../user-role.entity';
import { Permission } from './permission.entity';

@Entity()
export class UserRolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userRoleId: number;

  @Column()
  permissionId: number;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isCreate: boolean;

  @Column({ default: false })
  isUpdate: boolean;

  @Column({ default: false })
  isDelete: boolean;

  @Column({ default: false })
  isExecute: boolean;

  @ManyToOne(() => UserRole, userRole => userRole.permissions)
  userRole: UserRole;

  @ManyToOne(() => Permission, permission => permission.userRolePermissions)
  permission: Permission;
}