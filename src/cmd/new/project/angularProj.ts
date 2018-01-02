import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import * as path from "path";
import { unzipPath } from "zip-i/es";
import { GlobalData } from "../../../model/globalData";
import { editPackageJson } from "../../../common/util";
import { TemplateData } from "../../../common/template";

export class AngularProj extends BaseProj {
  getQuestions() {
    let questionList: Questions[] = [
      {
        name: "antDesign",
        type: "list",
        message: "是否引入Ant Design",
        default: "是",
        choices: ["是", "否"]
      }
    ];

    return questionList;
  }
  async run() {
    let answer = await this.getAnswers();

    let templateZipFile = TemplateData.getProjectTemplate("angular.zip");

    await unzipPath(templateZipFile, GlobalData.projectRootPath);

    await this.addAntDesign();
  }

  private async addAntDesign() {
    await editPackageJson(json => {
      Object.assign(json.devDependencies, {
        "ng-zorro-antd": "^0.6.8"
      });
    });
  }
}
