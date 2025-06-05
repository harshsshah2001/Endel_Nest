import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRolePermission } from './entities/user-role-permission.entity';
import { User } from 'src/team B/users/user.entity'; // ✅ Adjust if path is different

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userRoleName: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => UserRolePermission, userRolePermission => userRolePermission.userRole)
  permissions: UserRolePermission[];

  // ✅ Add this line to fix the error
  @OneToMany(() => User, user => user.userRole)
  users: User[];
}
