import { DataSourceOptions } from 'typeorm';
import { Topic, Trivia } from '../trivia/entities/';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = async (
  configService: ConfigService,
): Promise<DataSourceOptions> => {
  return {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: Number(configService.get('POSTGRES_PORT')),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DATABASE'),
    migrationsRun: false,
    useUTC: true,
    entities: [Topic, Trivia],
    synchronize: true,
    logging: false,
    migrations: ['src/database/migrations/*.ts'],
  };
};

// export const typeOrmConfig = async (
//   configService: ConfigService,
// ): Promise<DataSourceOptions> => {
//   return {
//     type: 'sqlite',
//     database: 'database.sqlite',
//     entities: [Topic, Trivia],
//     synchronize: true,
//     logging: false,
//     migrations: ['src/migrations/*.ts'],
//   };
// };
