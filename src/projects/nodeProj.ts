import { BaseProj } from "./baseProj";
import { Questions } from "inquirer";
import { mkdirs } from "fs-i";
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

    let projPath = `${process.cwd()}/${GlobalData.projectName}`;

    if (answer.needDocs === "是") {
      this.addDocs(projPath);
    }

    if (answer.unittest === "是") {
      this.addUnitTest(projPath);
    }
  }

  private async addDocs(path: string) {
    // package.json
    {
      let file = `${path}/package.json`;
      let fileContent = readFileSync(file, { encoding: "utf-8" });
      let json = JSON.parse(fileContent);

      json.devDependencies["typedoc"] = "^0.9.0";
      json.devDependencies["typedoc-format"] = "^1.0.0-beta1";

      json.scripts["docs"] = "typedoc --out docs src --module commonjs --hideGenerator && node ./tools/formatDocs.js";
      json.scripts["build"] = "npm run clean && npm run tsBuild && npm run docs";
      fileContent = JSON.stringify(json, null, 2);
      await writeFileSync(file, fileContent);
    }
  }
  private async addUnitTest(path: string) {
    // package.json
    {
      let file = `${path}/package.json`;
      let fileContent = readFileSync(file, { encoding: "utf-8" });
      let json = JSON.parse(fileContent);

      json.devDependencies["@types/chai"] = "^4.0.5";
      json.devDependencies["chai"] = "^4.1.2";
      json.devDependencies["@types/mocha"] = "^2.2.44";
      json.devDependencies["mocha"] = "^4.0.1";

      json.devDependencies["coveralls"] = "^3.0.0";
      json.devDependencies["nyc"] = "^11.3.0";

      json.devDependencies["source-map-support"] = "^0.5.0";
      json.devDependencies["ts-node"] = "^3.3.0";

      json.scripts["test"] = "nyc mocha -t 5000";
      json.scripts["test-nyc"] = "nyc npm test && nyc report --reporter=text-lcov | coveralls";

      json["nyc"] = {
        include: ["src/**/*.ts"],
        extension: [".ts"],
        require: ["ts-node/register"],
        sourceMap: true,
        instrument: true
      };

      fileContent = JSON.stringify(json, null, 2);

      await writeFileSync(file, fileContent);
    }

    // .travis.yml
    {
      let file = `${path}/.travis.yml`;
      let fileContent = readFileSync(file, { encoding: "utf-8" });

      fileContent = fileContent.replace(/script\s*:/, (w, a, b, c, d) => {
        return (
          w +
          `
  - npm run test`
        );
      });

      fileContent = fileContent.replace(/after_script\s*:/, (w, a, b, c, d) => {
        return (
          w +
          `
  - npm run test-nyc`
        );
      });

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
      await writeFileSync(file, fileContent);
    }

    // test js
    {
      let testPath = `${path}/test`;
      await mkdirs(testPath);

      await writeFileSync(
        `${testPath}/mocha.opts`,
        `
--require ts-node/register
--require source-map-support/register
--full-trace
--bail
test/**/*.test.ts
      `.trim(),
        { encoding: "utf8" }
      );

      await writeFileSync(
        `${testPath}/test.test.ts`,
        `
import { expect } from "chai";
import "mocha";
import { add } from "../src/index";

describe("test", function() {
  before(async () => {});
  after(async () => {});

  it("add should be success", async () => {
    expect(add(1, 2)).to.equal(3);
  });
});   
      `.trim(),
        { encoding: "utf8" }
      );
    }
  }
}
