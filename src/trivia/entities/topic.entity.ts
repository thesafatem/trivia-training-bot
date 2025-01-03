import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
