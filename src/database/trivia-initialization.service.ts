import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TriviaService } from '../trivia/trivia.service';
import { Trivia } from '../trivia/entities';
import * as africanCountries from './seeders/african-capitals.json';
import { TopicEnum } from '../trivia/entities/topic.enum';

@Injectable()
export class TriviaInitializationService implements OnApplicationBootstrap {
  constructor(private readonly triviaService: TriviaService) {}

  async onApplicationBootstrap() {
    await this.initializeAfricanCapitals();
  }

  private async initializeTopicAndTrivia(
    topicName: string,
    trivia: Pick<Trivia, 'question' | 'answer'>[],
  ) {
    const topic = await this.triviaService.createTopic(topicName);

    const triviaWithTopic = trivia.map((item) => {
      return {
        topicId: topic.id,
        question: item.question,
        answer: item.answer,
      };
    });

    for (const trivia of triviaWithTopic) {
      await this.triviaService.createTrivia(
        trivia.topicId,
        trivia.question,
        trivia.answer,
      );
    }
  }

  private async initializeAfricanCapitals() {
    const topicName = TopicEnum.AfricanCapitals;
    const trivia = africanCountries;
    await this.initializeTopicAndTrivia(topicName, trivia);
  }
}
