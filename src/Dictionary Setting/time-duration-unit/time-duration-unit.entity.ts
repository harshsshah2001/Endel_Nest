import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('time_duration_unit')
export class TimeDurationUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}