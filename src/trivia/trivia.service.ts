import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic, Trivia } from './entities';

@Injectable()
export class TriviaService {
  constructor(
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,

    @InjectRepository(Trivia)
    private triviaRepository: Repository<Trivia>,
  ) {}

  async createTopic(name: string): Promise<Topic> {
    let topic = await this.topicRepository.findOneBy({ name });
    if (!topic) {
      topic = new Topic();
      topic.name = name;
      await this.topicRepository.save(topic);
    }
    return topic;
  }

  async createTrivia(
    topicId: number,
    question: string,
    answer: string,
    file?: string,
  ): Promise<Trivia> {
    let trivia = await this.triviaRepository.findOne({
      where: {
        question,
        topic: {
          id: topicId,
        },
      },
    });
    if (!trivia) {
      trivia = new Trivia();
      trivia.question = question;
      trivia.answer = answer;
      trivia.topic = await this.topicRepository.findOneBy({ id: topicId });
      trivia.file = file;
      await this.triviaRepository.save(trivia);
    }

    return trivia;
  }

  async getTriviaByTopic(topicId: number): Promise<Trivia[]> {
    return this.triviaRepository.find({
      where: { topic: { id: topicId } },
    });
  }
}
