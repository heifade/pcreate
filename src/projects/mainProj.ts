import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import { unzipPath } from "zip-i";
import { getAllFiles, mkdirs, rmdir, readFileUtf8 } from "fs-i";
import { readFileSync, writeFileSync, copySync, rmdirSync, emptyDirSync } from "fs-extra";
import * as path from "path";
import { GlobalData } from "../model/globalData";
import { ProjectType, newProjectType } from "../model/ProjectType";

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
    GlobalData.projectType = newProjectType(answer.projectType);

    let targetPath = `${process.cwd()}/${answer.projectName}`;

    let templateZipFile = path.join(__dirname, "..", "template/node.zip");

    await mkdirs(targetPath);
    await unzipPath(templateZipFile, targetPath);
    await this.replaceProjectName(targetPath, answer);
  }

  private async replaceProjectName(path: string, answer: any) {
    let files = await getAllFiles(path);

    for (let file of files) {
      let fileContent = await readFileUtf8(file);
      fileContent = fileContent.replace(/{{projectName}}/g, answer.projectName);
      writeFileSync(file, fileContent);
    }
  }
}
