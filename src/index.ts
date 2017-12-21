import { prompt } from "inquirer";
import { createProject } from "./createProject";
import { Answer } from "./model/answer";

let questionList = [
  {
    type: "list",
    name: "unittest",
    message: "是否需要创建单元测试？",
    default: "是",
    choices: ["是", "否"]
  },
  {
    name: "projectName",
    type: "input",
    message: "请输入项目名称",
    default: "project1"
  }
];

async function getQuestionAnswers() {
  let answer = new Answer();

  for (let q of questionList) {
    let a = await prompt(q);
    let key = Reflect.ownKeys(a)[0];
    let value = Reflect.get(a, key);
    Reflect.set(answer, key, value);
  }
  return answer;
}

getQuestionAnswers().then(answer => {
  createProject(answer);
}).catch(err => {
  console.log(err);
})
