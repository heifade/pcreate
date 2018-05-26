import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import { GlobalData } from "../../../model/globalData";
import { ProjectType } from "../../../model/ProjectType";
import * as path from "path";
import { unzipPath } from "zip-i";
import { editFile, editPackageJson } from "../../../common/util";
import { TemplateData } from "../../../common/template";

export class WebpackProj extends BaseProj {
  getQuestions() {
    let questionList: Questions[] = [];

    return questionList;
  }
  async run() {
    if (GlobalData.projectType !== ProjectType.webpack) {
      return;
    }

    let templateZipFile = TemplateData.getProjectTemplate("webpack.zip");
    await unzipPath(templateZipFile, GlobalData.projectRootPath);
  }
}
