import { DataSource } from 'typeorm';
import { Topic, Trivia } from '../trivia/entities';

// export const AppDataSource = new DataSource({
//   type: 'sqlite',
//   driver: 'better-sqlite3',
//   database: 'database.sqlite',
//   synchronize: false,
//   logging: false,
//   entities: [Topic, Trivia],
//   migrations: ['src/migrations/*.ts'],
//   subscribers: [],
// });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'test',
  migrationsRun: false,
  useUTC: true,
  entities: [Topic, Trivia],
  synchronize: true,
  logging: false,
  migrations: ['src/database/migrations/*.ts'],
});
