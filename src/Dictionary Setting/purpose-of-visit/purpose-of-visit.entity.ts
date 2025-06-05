import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('purpose_of_visit')
export class PurposeOfVisit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}