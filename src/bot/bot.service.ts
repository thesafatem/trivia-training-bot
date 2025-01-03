import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { TriviaService } from '../trivia/trivia.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Trivia } from '../trivia/entities';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly triviaService: TriviaService,
  ) {}

  private commands = ['/african_capital'];

  async sendAnswerOnLastTriviaCall(msg: TelegramBot.Message) {
    const cachedValue = await this.cacheManager.get<Trivia>(
      String(msg.from.id),
    );
    if (!cachedValue) {
      return;
    }
    await this.bot.sendMessage(
      msg.chat.id,
      `Правильный ответ на прошлый вопрос: ${cachedValue.answer}`,
    );
  }

  async checkAnswerOnLastTriviaCall(msg: TelegramBot.Message) {
    const cachedValue = await this.cacheManager.get<Trivia>(
      String(msg.from.id),
    );
    if (!cachedValue) {
      return;
    }
    if (msg.text.toLowerCase() === cachedValue.answer.toLowerCase()) {
      await this.bot.sendMessage(msg.chat.id, 'Правильно!');
      await this.cacheManager.del(String(msg.from.id));
    } else {
      await this.bot.sendMessage(msg.chat.id, `Неправильно!`);
    }
  }

  onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');

    this.bot = new TelegramBot(token, { polling: true });

    this.bot.onText(/\/african_capital/, async (msg) => {
      await this.sendAnswerOnLastTriviaCall(msg);

      try {
        const trivia =
          await this.triviaService.getTriviaByTopicName('african_capitals');

        if (!trivia || !Array.isArray(trivia) || trivia.length === 0) {
          await this.bot.sendMessage(
            msg.chat.id,
            'Нет данных для "african_capitals" в базе данных.',
          );
          return;
        }

        const randomTrivia = trivia[Math.floor(Math.random() * trivia.length)];

        const cacheKey = String(msg.from.id);

        await this.cacheManager.set(cacheKey, randomTrivia, 1000 * 3600 * 24);

        await this.bot.sendMessage(msg.chat.id, randomTrivia.question);
      } catch (error) {
        console.error('Error fetching African capital:', error);
        await this.bot.sendMessage(
          msg.chat.id,
          'Произошла ошибка при обработке команды.',
        );
      }
    });

    this.bot.onText(/.*/, async (msg) => {
      if (this.commands.includes(msg.text.toLowerCase())) {
        return;
      }
      await this.checkAnswerOnLastTriviaCall(msg);
    });
  }
}
