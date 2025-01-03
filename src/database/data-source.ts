import { DataSource } from 'typeorm';
import { Topic, Trivia } from '../trivia/entities';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: false,
  logging: false,
  entities: [Topic, Trivia],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
