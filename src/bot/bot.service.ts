import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: TelegramBot;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');

    this.bot = new TelegramBot(token, { polling: true });

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      await this.bot.sendMessage(chatId, `Hello, ${msg.from?.first_name}!`);
      console.log(msg?.from?.id);
    });
  }
}
