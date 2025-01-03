import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './database/data-source';
import { TriviaService } from './trivia/trivia.service';
import { Topic, Trivia } from './trivia/entities';
import * as africanCountries from './database/seeders/african-capitals.json';

async function addDefaultTriviaData() {
  const triviaService = new TriviaService(
    AppDataSource.getRepository(Topic),
    AppDataSource.getRepository(Trivia),
  );

  const africanCountriesTopic =
    await triviaService.createTopic('african_capitals');

  const africanCountriesTrivia = africanCountries.map((country) => {
    return {
      topicId: africanCountriesTopic.id,
      question: country.question,
      answer: country.answer,
    };
  });

  for (const trivia of africanCountriesTrivia) {
    await triviaService.createTrivia(
      trivia.topicId,
      trivia.question,
      trivia.answer,
    );
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  AppDataSource.initialize().then(() => addDefaultTriviaData());
}
bootstrap();
