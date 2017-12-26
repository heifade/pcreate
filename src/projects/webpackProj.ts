import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import { GlobalData } from "../model/globalData";
import { writeFileSync } from "fs";
import { ProjectType } from "../model/ProjectType";
import { readFileUtf8 } from "fs-i/es";

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
    this.savePackage(projPath);
  }

  private async saveWebpackConfig(path: string) {
    let file = `${path}/webpack.config.ts`;
    let fileContent = `
    import * as webpack from "webpack";
    import * as path from "path";
    
    let config: webpack.Configuration = {
      entry: {
        index: "./src/index.ts"
      },
      output: {
        path: path.resolve(__dirname, "es"),
        filename: "[name].js"
      },
      module: {
        rules: [{ test: /\.ts$/, use: "ts-loader" }]
      },
      target: "node",
      resolve: {
        extensions: [".ts", ".js"]
      },
      externals: {
        "fs-extra": "require('fs-extra')"
      }
    };
    
    export default config;
    
    
    `;
    await writeFileSync(file, fileContent);
  }

  private async savePackage(path: string) {
    let file = `${path}/package.json`;
    let fileContent = await readFileUtf8(file);
    let json = JSON.parse(fileContent);

    json.devDependencies["@types/webpack"] = "^3.8.1";
    json.devDependencies["webpack"] = "^3.10.0";
    json.devDependencies["ts-loader"] = "^3.2.0";

    json.scripts["tsBuild"] = "webpack";

    fileContent = JSON.stringify(json, null, 2);
    await writeFileSync(file, fileContent);
  }
}
