import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Appointment {
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

  @Column({ type: 'time', nullable: true })
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
  notes: string;

  @Column({ type: 'boolean', default: false })
  isformcompleted: boolean;

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

  @Column({ type: 'boolean', default: false })
  ndaApproved: boolean;

  @Column({ type: 'boolean', default: false })
  SaftyApproval: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: false })
  inprogress: boolean;

  @Column({ default: false })
  complete: boolean;

  @Column({ default: false })
  exit: boolean;
}