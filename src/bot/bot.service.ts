import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { User } from 'node-telegram-bot-api';
import { TriviaService } from '../trivia/trivia.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Trivia } from '../trivia/entities';
import { TopicEnum } from '../trivia/entities/topic.enum';
import { ProbabilityTrivia, TriviaState } from '../trivia/trivia-state.class';

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

  async getRandomTrivia(user: User, topic: TopicEnum): Promise<Trivia> {
    const key = `${topic}_${user.id}`;
    const triviaStateCached =
      await this.cacheManager.get<ProbabilityTrivia[]>(key);
    let triviaState: TriviaState;
    if (!triviaStateCached) {
      const trivia = await this.triviaService.getTriviaByTopicName(topic);
      triviaState = new TriviaState(trivia);
      triviaState.setEqualProbabilities();
    } else {
      triviaState = new TriviaState(triviaStateCached);
    }
    const randomTrivia = triviaState.getRandomTrivia();
    console.log(triviaState.getInfo());
    triviaState.useTrivia(randomTrivia.id);
    await this.cacheManager.set(key, triviaState.getTrivia());
    return randomTrivia;
  }

  onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');

    this.bot = new TelegramBot(token, { polling: true });

    this.bot.onText(/\/african_capital/, async (msg) => {
      await this.sendAnswerOnLastTriviaCall(msg);

      try {
        const randomTrivia = await this.getRandomTrivia(
          msg.from,
          TopicEnum.AfricanCapitals,
        );

        if (!randomTrivia) {
          await this.bot.sendMessage(
            msg.chat.id,
            'Нет данных по данному запросу.',
          );
          return;
        }

        const cacheKey = String(msg.from.id);

        await this.cacheManager.set(cacheKey, randomTrivia, 1000 * 3600 * 24);

        await this.bot.sendMessage(msg.chat.id, randomTrivia.question);
      } catch (error) {
        console.log(error);
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
