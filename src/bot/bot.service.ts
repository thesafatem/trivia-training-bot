import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { TriviaService } from '../trivia/trivia.service';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    private readonly configService: ConfigService,
    private readonly triviaService: TriviaService,
  ) {}

  onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');

    this.bot = new TelegramBot(token, { polling: true });

    this.bot.onText(/\/african_capital/, async (msg) => {
      try {
        const trivia =
          await this.triviaService.getTriviaByTopicName('african_capitals');

        if (!trivia || !Array.isArray(trivia) || trivia.length === 0) {
          await this.bot.sendMessage(
            msg.chat.id,
            'Нет данных для "african-capitals" в базе данных.',
          );
          return;
        }

        const randomTrivia = trivia[Math.floor(Math.random() * trivia.length)];
        await this.bot.sendMessage(msg.chat.id, randomTrivia.question);
      } catch (error) {
        console.error('Error fetching African capital:', error);
        await this.bot.sendMessage(
          msg.chat.id,
          'Произошла ошибка при обработке команды.',
        );
      }
    });
  }
}
