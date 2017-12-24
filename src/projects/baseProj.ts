import { Questions } from "inquirer";
import { prompt } from "inquirer";

export abstract class BaseProj {
  abstract getQuestions(): Questions[];
  abstract run(): void;

  async getAnswers() {
    let answer: any = {};

    let questionList = this.getQuestions();

    for (let q of questionList) {
      let a = await prompt(q);
      let key = Reflect.ownKeys(a)[0];
      let value = Reflect.get(a, key);
      Reflect.set(answer, key, value);
    }
    return answer;
  }
}
