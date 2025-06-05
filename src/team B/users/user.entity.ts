import { UserRole } from 'src/user-roles/user-role.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'user_name', unique: true })
  userName: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'contact_no', nullable: true })
  contactNo: string;

  @Column({ name: 'email_id', nullable: true })
  emailId: string;

  @Column({ name: 'address', nullable: true })
  address: string;

  @Column({ name: 'user_role_id' })
  userRoleId: number;

  // ✅ Add relation to UserRole
  @ManyToOne(() => UserRole, userRole => userRole.users, { eager: false })
  @JoinColumn({ name: 'user_role_id' }) // Link it to userRoleId column
  userRole: UserRole;

  @Column({ name: 'notes', nullable: true })
  notes: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'employee_no', nullable: true })
  employeeNo: string;

  @Column({ name: 'department', nullable: true })
  department: string;

  @Column({ name: 'designation', nullable: true })
  designation: string;
}
