import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRolePermission } from './user-role-permission.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permissionName: string;

  @Column({ default: false })
  isMaster: boolean;

  @Column({ default: 1 })
  isReadDisplay: boolean;

  @Column({ default: 1 })
  isCreateDisplay: boolean;

  @Column({ default: 1 })
  isUpdateDisplay: boolean;

  @Column({ default: 1 })
  isDeleteDisplay: boolean;

  @Column({ default: 1 })
  isExecuteDisplay: boolean;

  @OneToMany(() => UserRolePermission, permission => permission.permission)
  userRolePermissions: UserRolePermission[];
}