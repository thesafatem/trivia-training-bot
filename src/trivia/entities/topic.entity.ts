import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('topic')
@Unique(['name'])
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
