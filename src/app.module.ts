import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Topic, Trivia } from './trivia/entities';
import { TriviaService } from './trivia/trivia.service';
import { typeOrmConfig } from './config/typeorm.config';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BotModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Topic, Trivia]),
  ],
  controllers: [AppController],
  providers: [AppService, TriviaService],
})
export class AppModule {}
