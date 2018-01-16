import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import { mkdirs, saveFileUtf8Sync } from "fs-i";
import { GlobalData } from "../../../model/globalData";
import * as path from "path";
import { unzipPath } from "zip-i";
import { editPackageJson, editFile } from "../../../common/util";
import { writeFileSync } from "fs";
import { TemplateData } from "../../../common/template";
import { ProjectType, getProjectTypeName } from "../../../model/ProjectType";

export class NodeProj extends BaseProj {
  getQuestions() {
    let questionList: Questions[] = [
      {
        name: "needDocs",
        type: "list",
        message: "是否需要有开发文档",
        default: "否",
        choices: ["是", "否"]
      },
      {
        name: "unittest",
        type: "list",
        message: "是否需要创建单元测试？",
        default: "否",
        choices: ["是", "否"]
      },
      {
        name: "isCommand",
        type: "list",
        message: "是否创建命令？",
        default: "否",
        choices: ["是", "否"]
      }
    ];

    return questionList;
  }
  async run() {
    let answer = await this.getAnswers();

    let templateZipFile = TemplateData.getProjectTemplate("node.zip");

    await unzipPath(templateZipFile, GlobalData.projectRootPath);

    if (answer.needDocs === "是") {
      this.addDocs();
    }

    if (answer.unittest === "是") {
      this.addUnitTest();
    }

    if (answer.isCommand === "是") {
      this.addCommand();
    }

    this.createYml(answer);
    this.createProjectConfig(answer);
  }

  private async addDocs() {
    // package.json
    await editPackageJson(GlobalData.projectRootPath, json => {});
  }
  private async addUnitTest() {
    // package.json
    await editPackageJson(GlobalData.projectRootPath, json => {
      Object.assign(json.devDependencies, {
        "@types/chai": "^4.1.0",
        chai: "^4.1.2",
        "@types/mocha": "^2.2.46",
        mocha: "^4.1.0"
      });
    });
  }
  private async addCommand() {
    // package.json
    await editPackageJson(GlobalData.projectRootPath, json => {
      Object.assign(json.devDependencies, {
        chalk: "^2.3.0",
        yargs: "^10.1.1"
      });
    });
  }
  private async createYml(answer: any) {
    let fileContent = `
language: node_js
sudo: enabled
node_js:
  - "8"
before_script:
  - npm i pcreate
  - pcreate test -c
script:
  - pcreate build
after_script:

cache:
  directories:
    - node_modules

deploy:
  - provider: npm
    skip_cleanup: true
    email: heifade@126.com
    api_key: $NPM_TOKEN
    on:
      branch: master
      repo: heifade/${GlobalData.projectName}
  ${
    answer.needDocs === "是"
      ? `
  - provider: pages
    skip_cleanup: true
    github_token: $GITHUB_TOKEN
    local_dir: docs
    on:
      branch: master`.trim()
      : ""
  }
`;

    saveFileUtf8Sync(path.join(GlobalData.projectRootPath, ".travis.yml"), fileContent);
  }

  private async createProjectConfig(answer: any) {
    let fileContent = `
import { ProjectConfigModel } from "pcreate-config";

let projectConfig: ProjectConfigModel = {
  projectType: "${getProjectTypeName(GlobalData.projectType)}",
  compile: {
    outDir: "./es/",
    module: "commonjs",
    target: "es5",
    lib: ["es2015", "es2015.promise", "es2015.symbol"],
    declaration: true
  },
  command: ${answer.isCommand === "是" ? "true" : "false"},
  documents: ${answer.needDocs === "是" ? "true" : "false"},
  unitTest: ${answer.unittest === "是" ? "true" : "false"},
  sourceInclude: ["./src/**/*"]
};

export default projectConfig;
    `;

    saveFileUtf8Sync(path.join(GlobalData.projectRootPath, "project-config.ts"), fileContent);
  }
}
