import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import { mkdirs } from "fs-i";
import { GlobalData } from "../../../model/globalData";
import * as path from "path";
import { unzipPath } from "zip-i";
import { editPackageJson, editFile } from "../../../common/util";
import { writeFileSync } from "fs";
import { TemplateData } from "../../../common/template";

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

    // if (answer.isCommand === "是") {
    //   this.addCommand();
    // }
  }

  private async addDocs() {
    // package.json
    await editPackageJson(GlobalData.projectRootPath, json => {
      
    });
  }
  private async addUnitTest() {
    // package.json
    await editPackageJson(GlobalData.projectRootPath, json => {
      Object.assign(json.devDependencies, {
        "@types/chai": "^4.0.5",
        chai: "^4.1.2",
        "@types/mocha": "^2.2.44",
        mocha: "^4.0.1",
      });
    });

    // .travis.yml
    {
      await editFile(path.join(GlobalData.projectRootPath, ".travis.yml"), fileContent => {
        fileContent = fileContent.replace(/\nscript\s*:/, (w, a, b, c, d) => {
          return (
            w +
            `
  - pcreate test`
          );
        });

  //       fileContent = fileContent.replace(/after_script\s*:/, (w, a, b, c, d) => {
  //         return (
  //           w +
  //           `
  // - npm run test-nyc`
  //         );
  //       });

        fileContent = fileContent.replace(/deploy\s*:/, (w, a, b, c, d) => {
          return (
            w +
            `
    - provider: pages
      skip_cleanup: true
      github_token: $GITHUB_TOKEN
      local_dir: docs
      on:
        branch: master
  `
          );
        });
        return fileContent;
      });
    }

    // test js
    {
      let testPath = path.join(GlobalData.projectRootPath, "test");
      await mkdirs(testPath);

      writeFileSync(
        path.join(testPath, "mocha.opts"),
        `
--require ts-node/register
--require source-map-support/register
--full-trace
--bail
test/**/*.test.ts
        `.trim()
      );

      writeFileSync(
        path.join(testPath, "index.test.ts"),
        `
import { expect } from "chai";
import "mocha";
import { add } from "../src/index";

describe("index", function() {
  before(async () => {});
  after(async () => {});

  it("add should be success", async () => {
    expect(add(1, 2)).to.equal(3);
  });
});   
      `.trim()
      );
    }
  }

  
}
