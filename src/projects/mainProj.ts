import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import { unzipPath } from "zip-i";
import { getAllFiles, mkdir, rmdir } from "fs-i";
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

    await mkdir(targetPath);
    await unzipPath(templateZipFile, targetPath);
    await this.replaceProjectName(targetPath, answer);
  }

  async replaceProjectName(path: string, answer: any) {
    let files = await getAllFiles(path);

    for (let file of files) {
      let fileContent = readFileSync(file, { encoding: "utf-8" });
      fileContent = fileContent.replace(/{{projectName}}/g, answer.projectName);

      fileContent = await this.editPackageJson(file, fileContent, answer);

      writeFileSync(file, fileContent);
    }
  }

  async editPackageJson(file: string, fileContent: string, answer: any) {
    file = file.replace(/\\/g, "/");
    file = file.substr(file.lastIndexOf("/") + 1);

    if (file === "package.json") {
      if (answer.needDocs === "否") {
        let json = JSON.parse(fileContent);
        delete json.devDependencies.typedoc;
        delete json.scripts.docs;
        json.scripts.build = json.scripts.build.replace(/\s*&&\s*npm\s*run\s*docs\s*/, "");
        fileContent = JSON.stringify(json, null, 2);
      }

      if (answer.unittest === "否") {
        let json = JSON.parse(fileContent);
        delete json.devDependencies["@types/chai"];
        delete json.devDependencies["@types/mocha"];
        delete json.devDependencies["source-map-support"];
        delete json.devDependencies["ts-node"];
        delete json.devDependencies["typedoc-format"];
        delete json.devDependencies.chai;
        delete json.devDependencies.coveralls;
        delete json.devDependencies.mocha;
        delete json.devDependencies.nyc;
        delete json.scripts.test;
        delete json.scripts["test-nyc"];
        delete json.nyc;

        fileContent = JSON.stringify(json, null, 2);
      }
    }

    if (file == ".travis.yml") {
      if (answer.unittest === "否") {
        fileContent = fileContent
          .replace(/(script\s*:)((.|\n)*?)(\s*-\s*npm\s*run\s*test)/, (w, a, b, c, d) => {
            return w.replace(d, "");
          })
          .replace(/(after_script\s*:)((.|\n)*?)(\s*-\s*npm\s*run\s*test-nyc)/, (w, a, b, c, d) => {
            return w.replace(a, "").replace(d, "");
          })
          .replace(/(-\s*provider:\s*pages\s*)([^-]*)/, "");
      }
    }

    return fileContent;
  }
}
