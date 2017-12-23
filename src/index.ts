import { command, Argv } from "yargs";
import { prompt } from "inquirer";
import { createProject } from "./createProject";
import { Answer } from "./model/answer";

let questionList = [
  {
    name: "projectName",
    type: "input",
    message: "请输入项目名称",
    default: "project1"
  },
  {
    name: "needDocs",
    type: "list",
    message: "是否需要有开发文档",
    default: "否",
    choices: ["是", "否"]
  },
  {
    name: "unittest",
    type: "list",
    message: "是否需要创建单元测试？",
    default: "否",
    choices: ["是", "否"]
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

async function run() {
  let answer = await getQuestionAnswers();
  await createProject(answer);


  let subCmd = command("pc-node", "node", (yargs: Argv) => {
    return yargs;
  }).argv;

  

  
}

run()
  .then(() => {
    
  })
  .catch(err => {
    console.log(err);
  });

process.on("SIGINT", function() {
  process.exit(0);
});
