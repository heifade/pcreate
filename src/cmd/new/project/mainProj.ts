import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import { unzipPath } from "zip-i";
import { getAllFiles, mkdirs, rmdir } from "fs-i";
import * as path from "path";
import { GlobalData } from "../../../model/globalData";
import { ProjectType, newProjectType } from "../../../model/ProjectType";
import { AngularProj } from "./angularProj";
import { WebpackProj } from "./webpackProj";
import { NodeProj } from "./nodeProj";
import { editFile } from "../../../common/util";

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
        choices: ["node", "webpack", "angular"]
      }
    ];

    return questionList;
  }
  async run() {
    let answer = await this.getAnswers();

    GlobalData.projectName = answer.projectName;
    GlobalData.projectType = newProjectType(answer.projectType);

    GlobalData.projectRootPath = path.join(process.cwd(), answer.projectName);
    await mkdirs(GlobalData.projectRootPath);

    let nodeProj = new NodeProj();
    let angularProj = new AngularProj();
    let webpackProj = new WebpackProj();

    switch (GlobalData.projectType) {
      case ProjectType.node:
        await nodeProj.run();
        break;
      case ProjectType.webpack:
        await webpackProj.run();
        break;
      case ProjectType.angular:
        await angularProj.run();
        break;
    }

    await this.replaceProjectName();
  }

  private async replaceProjectName() {
    let files = await getAllFiles(GlobalData.projectRootPath);

    for (let file of files) {
      await editFile(file, fileContent => {
        return fileContent.replace(/{{projectName}}/g, GlobalData.projectName);
      });
    }
  }
}
