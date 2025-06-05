import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gender')
export class Gender {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}