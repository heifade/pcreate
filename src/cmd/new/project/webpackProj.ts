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

    this.saveWebpackConfig();
    this.savePackage();
  }

  private async saveWebpackConfig() {
    await editFile(path.join(GlobalData.projectRootPath, "webpack.config.ts"), fileContent => {
      return fileContent;
    });
  }

  private async savePackage() {
    await editPackageJson(GlobalData.projectRootPath, json => {
      Object.assign(json.devDependencies, {
        "@types/webpack": "^3.8.1",
        webpack: "^3.10.0",
        "ts-loader": "^3.2.0",
        "babel-core": "^6.26.0",
        "babel-loader": "^7.1.2",
        "babel-preset-es2015": "^6.24.1"
      });

      Object.assign(json.scripts, {
        tsBuild: "webpack"
      });
    });
  }
}
