import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import { GlobalData } from "../model/globalData";
import { writeFileSync } from "fs";
import { ProjectType } from "../model/ProjectType";
import { readFileUtf8 } from "fs-i/es";
import * as path from "path";
import { unzipPath } from "zip-i";

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

    let templateZipFile = path.join(__dirname, "..", "template/webpack.zip");
    await unzipPath(templateZipFile, projPath);

    this.saveWebpackConfig(projPath);
    this.savePackage(projPath);
  }

  private async saveWebpackConfig(path: string) {
    let file = `${path}/webpack.config.ts`;
    let fileContent = await readFileUtf8(file);
    await writeFileSync(file, fileContent);
  }

  private async savePackage(path: string) {
    let file = `${path}/package.json`;
    let fileContent = await readFileUtf8(file);
    let json = JSON.parse(fileContent);

    json.devDependencies["@types/webpack"] = "^3.8.1";
    json.devDependencies["webpack"] = "^3.10.0";
    json.devDependencies["ts-loader"] = "^3.2.0";
    json.devDependencies["babel-core"] = "^6.26.0";
    json.devDependencies["babel-loader"] = "^7.1.2";
    json.devDependencies["babel-preset-es2015"] = "^6.24.1";

    json.scripts["tsBuild"] = "webpack";

    fileContent = JSON.stringify(json, null, 2);
    await writeFileSync(file, fileContent);
  }
}
