import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic, Trivia } from './trivia/entities';
import { TriviaService } from './trivia/trivia.service';
import { typeOrmConfig } from './config/typeorm.config';
import { BotModule } from './bot/bot.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { getRedisConfig } from './config/redis.config';
import { TriviaInitializationService } from './database/trivia-initialization.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BotModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    TypeOrmModule.forFeature([Topic, Trivia]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getRedisConfig,
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  providers: [TriviaService, TriviaInitializationService],
})
export class AppModule {}
