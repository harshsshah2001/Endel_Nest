// master-record.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn , Unique } from 'typeorm';
import { Visitor } from '../team A/employee_sends_visitor_data/visitor.entity';
import { Appointment } from '../team B/appointment/appointment.entity';

@Entity()
@Unique(['visitorId', 'recordType'])
@Unique(['appointmentId', 'recordType'])
export class MasterRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  contactnumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  nationalid: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  visit: string;

  @Column({ nullable: true })
  personname: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  durationtime: string;

  @Column({ nullable: true })
  durationunit: string;

  @Column({ nullable: true })
  visitortype: string;

  @Column({ nullable: true })
  vehicletype: string;

  @Column({ nullable: true })
  vehiclenumber: string;

  @Column({ nullable: true })
  drivername: string;

  @Column({ nullable: true })
  drivermobile: string;

  @Column({ nullable: true })
  drivernationalid: string;

  @Column({ nullable: true })
  driverphoto: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: false })
  inprogress: boolean;

  @Column({ default: false })
  complete: boolean;

  @Column({ default: false })
  exit: boolean;

  @Column({ default: false })
  isformcompleted: boolean;


  @Column({ type: 'varchar' })
  recordType: 'spot' | 'preapproval';

  // ✅ Add foreign key to Visitor
  @ManyToOne(() => Visitor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'visitorId' })
  visitor: Visitor;

  @Column({ nullable: true })
  visitorId: number;

  // ✅ Add foreign key to Appointment
  @ManyToOne(() => Appointment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @Column({ nullable: true })
  appointmentId: number;
}
