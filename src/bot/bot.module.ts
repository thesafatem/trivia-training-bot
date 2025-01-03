import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { TriviaModule } from '../trivia/trivia.module';

@Module({
  providers: [BotService],
  imports: [TriviaModule],
})
export class BotModule {}
