import { Trivia } from './entities';

export interface ProbabilityTrivia extends Trivia {
  probability: number;
}

const isProbabilityTrivia = (trivia: Trivia): trivia is ProbabilityTrivia => {
  return 'probability' in trivia;
};

export class TriviaState {
  private readonly probabilityTrivia: ProbabilityTrivia[];

  constructor(trivia: Trivia[]) {
    this.probabilityTrivia = trivia.map((item) => {
      return {
        ...item,
        probability: isProbabilityTrivia(item) ? item.probability : 0,
      };
    });
  }

  private randomShuffle() {
    for (let i = this.probabilityTrivia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.probabilityTrivia[i], this.probabilityTrivia[j]] = [
        this.probabilityTrivia[j],
        this.probabilityTrivia[i],
      ];
    }
  }

  setEqualProbabilities() {
    const count = this.probabilityTrivia.length;
    const singleProbability = 100 / count;
    for (const trivia of this.probabilityTrivia) {
      trivia.probability = singleProbability;
    }
  }

  getRandomTrivia(): Trivia {
    this.randomShuffle();
    const randomUniformValue = Math.random();
    let sum = 0;
    for (let i = 0; i < this.probabilityTrivia.length; i++) {
      if (sum >= randomUniformValue) {
        return this.probabilityTrivia[i];
      }
      sum += this.probabilityTrivia[i].probability;
    }
    return this.probabilityTrivia[this.probabilityTrivia.length - 1];
  }

  useTrivia(triviaId: number) {
    let usedTriviaProbability = 0;
    this.probabilityTrivia.forEach((item) => {
      if (item.id === triviaId) {
        usedTriviaProbability = item.probability;
        item.probability = 0;
      }
    });
    const count = this.probabilityTrivia.length - 1;
    const singleProbabilityDelta = usedTriviaProbability / count;
    for (const trivia of this.probabilityTrivia) {
      if (trivia.id !== triviaId) {
        trivia.probability += singleProbabilityDelta;
      }
    }
  }

  getTrivia() {
    return this.probabilityTrivia;
  }

  getInfo() {
    return this.probabilityTrivia.map((item) => {
      return [item.question, item.probability];
    });
  }
}
