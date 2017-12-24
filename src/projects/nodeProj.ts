import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import { mkdir } from "fs-i";
import { writeFileSync, readFileSync } from "fs-extra";
import { GlobalData } from "../model/globalData";

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
      }
    ];

    return questionList;
  }
  async run() {
    let answer = await this.getAnswers();

    if (answer.unittest === "是") {
      let projPath = `${process.cwd()}/${GlobalData.projectName}`;
      let testPath = `${projPath}/test`;
      mkdir(testPath);

      writeFileSync(`${testPath}/mocha.opts`, `
--require ts-node/register
--require source-map-support/register
--full-trace
--bail
test/**/*.test.ts
      `.trim(), { encoding: "utf8" });

      writeFileSync(`${testPath}/test.test.ts`, `
import { expect } from "chai";
import "mocha";

describe("test", function() {
  before(async () => {});
  after(async () => {});

  it("test should be success", async () => {
    expect(1).to.equal(1);
  });
});   
      `.trim(), { encoding: "utf8" });




      let fileContent = readFileSync(`${testPath}/package.json`, { encoding: "utf-8" });
      let json = JSON.parse(fileContent);

      
      json.devDependencies["@types/chai"] = "^4.0.5";
      json.devDependencies["chai"] = "^4.1.2";
      json.devDependencies["@types/mocha"] = "^2.2.44";
      json.devDependencies["mocha"] = "^4.0.1";

      json.devDependencies["coveralls"] = "^3.0.0";
      json.devDependencies["nyc"] = "^11.3.0";

      json.devDependencies["source-map-support"] = "^0.5.0";
      json.devDependencies["ts-node"] = "^3.3.0";
      json.devDependencies["typedoc-format"] = "^1.0.0-beta1";
      
      json.scripts.test
      
      
      
      delete json.scripts.test;
      delete json.scripts["test-nyc"];
      delete json.nyc;

      fileContent = JSON.stringify(json, null, 2);



    }
  }
}
