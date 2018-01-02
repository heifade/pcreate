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

    if (answer.isCommand === "是") {
      this.addCommand();
    }
  }

  private async addDocs() {
    // package.json
    await editPackageJson(json => {
      Object.assign(json.devDependencies, {
        typedoc: "^0.9.0",
        "typedoc-format": "^1.0.2"
      });

      Object.assign(json, {
        docs: "typedoc --out docs src --module commonjs --hideGenerator && node ./tools/formatDocs.js",
        build: "npm run clean && npm run tsBuild && npm run docs"
      });
    });
  }
  private async addUnitTest() {
    // package.json
    await editPackageJson(json => {
      Object.assign(json.devDependencies, {
        "@types/chai": "^4.0.5",
        chai: "^4.1.2",
        "@types/mocha": "^2.2.44",
        mocha: "^4.0.1",
        coveralls: "^3.0.0",
        nyc: "^11.3.0",
        "source-map-support": "^0.5.0"
      });

      Object.assign(json.scripts, {
        test: "nyc mocha -t 5000",
        "test-nyc": "nyc npm test && nyc report --reporter=text-lcov | coveralls"
      });

      Object.assign(json, {
        nyc: {
          include: ["src/**/*.ts"],
          extension: [".ts"],
          require: ["ts-node/register"],
          sourceMap: true,
          instrument: true
        }
      });
    });

    // .travis.yml
    {
      await editFile(path.join(GlobalData.projectRootPath, ".travis.yml"), fileContent => {
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

  private async addCommand() {

    let projectName = GlobalData.projectName;

    // package.json
    await editPackageJson(json => {
      Object.assign(json, {
        bin: {
          [projectName]: `./es/bin/${projectName}`
        }
      });

      json.scripts["code-build"] = "tsc -p tsconfig.json && node ./tools/copy.js";
    });

    // bin
    let binPath = path.join(GlobalData.projectRootPath, "src", "bin");
    await mkdirs(binPath);

    writeFileSync(
      path.join(binPath, `${projectName}`),
      `
#!/usr/bin/env node
module.exports = require('../');
      `.trim()
    );

    writeFileSync(
      path.join(binPath, `${projectName}.cmd`),
      `
@IF EXIST "%~dp0\\node.exe" (
  "%~dp0\\node.exe"  "%~dp0\\..\\${projectName}\\bin\\${projectName}" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\\..\\${projectName}\\bin\\${projectName}" %*
)
      `.trim()
    );


  }
}
