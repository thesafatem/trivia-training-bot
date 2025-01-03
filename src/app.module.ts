import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BotModule],
})
export class AppModule {}
