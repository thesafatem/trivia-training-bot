import { Module } from '@nestjs/common';
import { TriviaService } from './trivia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic, Trivia } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, Trivia])],
  providers: [TriviaService],
  exports: [TriviaService],
})
export class TriviaModule {}
