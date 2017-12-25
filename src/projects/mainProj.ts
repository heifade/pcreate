import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import { unzipPath } from "zip-i";
import { getAllFiles, mkdirs, rmdir } from "fs-i";
import { readFileSync, writeFileSync, copySync, rmdirSync, emptyDirSync } from "fs-extra";
import * as path from "path";
import { GlobalData } from "../model/globalData";

export class MainProj extends BaseProj {
  getQuestions() {
    let questionList: Questions[] = [
      {
        name: "projectName",
        type: "input",
        message: "请输入项目名称",
        default: "project1"
      },
      {
        name: "projectType",
        type: "list",
        message: "请选择项目类型",
        default: "node",
        choices: ["node", "webpack", "angular2"]
      }
    ];

    return questionList;
  }
  async run() {
    let answer = await this.getAnswers();

    GlobalData.projectName = answer.projectName;

    let targetPath = `${process.cwd()}/${answer.projectName}`;

    let templateZipFile = path.join(__dirname, "..", "template/node.zip");

    await mkdirs(targetPath);
    await unzipPath(templateZipFile, targetPath);
    await this.replaceProjectName(targetPath, answer);
    
  }

  private async replaceProjectName(path: string, answer: any) {
    let files = await getAllFiles(path);

    for (let file of files) {
      let fileContent = readFileSync(file, { encoding: "utf-8" });
      fileContent = fileContent.replace(/{{projectName}}/g, answer.projectName);
      writeFileSync(file, fileContent);
    }
  }

  
}
