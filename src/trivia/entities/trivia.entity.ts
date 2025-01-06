import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Topic } from './topic.entity';

@Entity('trivia')
export class Trivia {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Topic, (topic) => topic.id)
  @JoinColumn({ name: 'topicId' })
  topic: Topic;

  @Column({
    type: 'text',
  })
  question: string;

  @Column({
    type: 'text',
  })
  answer: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  file: string | null;
}
