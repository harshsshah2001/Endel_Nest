import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('designations')
export class Designation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}