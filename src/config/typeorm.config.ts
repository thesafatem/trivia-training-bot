import { DataSourceOptions } from 'typeorm';
import { Topic, Trivia } from '../trivia/entities/';

export const typeOrmConfig: DataSourceOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [Topic, Trivia],
  synchronize: true,
  logging: false,
  migrations: ['src/migrations/*.ts'],
};
