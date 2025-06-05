import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('visitor_type')
export class VisitorType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}