import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import * as path from "path";
import { unzipPath } from "zip-i/es";
import { GlobalData } from "../model/globalData";

export class AngularProj extends BaseProj {
  getQuestions() {
    let questionList: Questions[] = [
      {
        name: "antDesign",
        type: "list",
        message: "是否引入Ant Design",
        default: "是",
        choices: ["是", "否"]
      },
    ];

    return questionList;
  }
  async run() {
    let answer = await this.getAnswers();

    let templateZipFile = path.join(__dirname, "..", "template/angular.zip");

    await unzipPath(templateZipFile, GlobalData.projectRootPath);
  }

  async addAntDesign() {
    
  }


}
