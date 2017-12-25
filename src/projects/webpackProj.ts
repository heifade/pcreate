import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import { GlobalData } from "../model/globalData";
import { writeFileSync } from "fs";
import { ProjectType } from "../model/ProjectType";

export class WebpackProj extends BaseProj {
  getQuestions() {
    let questionList: Questions[] = [];

    return questionList;
  }
  async run() {
    if (GlobalData.projectType !== ProjectType.webpack) {
      return;
    }

    let projPath = `${process.cwd()}/${GlobalData.projectName}`;
    this.saveWebpackConfig(projPath);
  }

  private async saveWebpackConfig(path: string) {
    let file = `${path}/webpack.config.js`;
    let fileContent = `
module.exports = {
  entry: './path/to/my/entry/file.js'
};
    `;
    await writeFileSync(file, fileContent);
  }
}
