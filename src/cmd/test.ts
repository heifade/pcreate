import { Argv, Arguments } from "yargs";
import { iBuilder } from "./build/iBuilder";
import { rmdirSync } from "fs-i";
import * as path from "path";
import { readProjectConfig } from "../tools/readProjectConfig";
import { NodeBuilder } from "./build/nodeBuilder";
import { printMessage, printSuccessMessage, printErrorMessage } from "../common/log";
import { projectConfigFile } from "../common/const";
import { getCreateProjectDependencies } from "../common/util";
import { spawnSync, SpawnSyncOptionsWithStringEncoding, execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { ProjectConfigModel } from "../model/projectConfig/ProjectConfigModel";

export let command = "test";
export let desc = "单元测试";
export let builder = (yargs: Argv) => {
  return yargs
    .option("p", {
      alias: "path",
      describe: "测试的目录",
      default: ".",
      type: "string"
    })
    .usage("Usage: $0 test -p .");
};

export let handler = async (yargs: any) => {
  let projectPath = path.resolve(yargs.p) || process.cwd();
  let configFileName = path.join(projectPath, projectConfigFile);
  let projectConfig = await readProjectConfig(configFileName);

  if (projectConfig.unitTest) {
    let mochapars = yargs.mochapars;
    test(projectPath, mochapars);
    coveralls(projectPath, mochapars);
  }
};

function test(projectPath: string, mochapars: string) {
  printMessage("单元测试开始...");

  let nyc = getCreateProjectDependencies(projectPath, path.join("nyc", "bin", "nyc.js"));
  let mocha = getCreateProjectDependencies(projectPath, path.join("mocha", "bin", "mocha"));

  let pars: Array<string> = [];

  if (mochapars) {
    mochapars = `{${mochapars
      .replace(/[\"\'\{\}]/g, "")
      .split(",")
      .map(h => `"${h.replace(/:/g, '":"')}"`)
      .join(",")}}`;

    let mochaparsObj = JSON.parse(mochapars);
    for (let k of Reflect.ownKeys(mochaparsObj)) {
      pars.push(`--${k}`);
      pars.push(Reflect.get(mochaparsObj, k));
    }
  }

  let options: SpawnSyncOptionsWithStringEncoding = {
    encoding: "utf8",
    cwd: projectPath,
    stdio: [process.stdin, process.stdout, process.stderr]
  };

  let childProcess = spawnSync(nyc, [mocha, "-t", "5000"].concat(pars), options);

  if (childProcess.status !== 0) {
    printErrorMessage(childProcess.error.message);
    printErrorMessage("单元测试失败！");
    process.exit(childProcess.status);
    return;
  }

  printMessage("单元测试成功结束");
}

function coveralls(projectPath: string, mochapars: string) {
  printMessage("覆盖率开始...");

  let nycrcFile = path.join(projectPath, ".nycrc");

  writeFileSync(
    nycrcFile,
    `{
  "include": [
    "src/**/*.ts"
  ],
  "extension": [
    ".ts"
  ],
  "require": [
    "ts-node/register"
  ],
  "sourceMap": true,
  "instrument": true
}`.trim()
  );

  let nyc = getCreateProjectDependencies(projectPath, path.join("nyc", "bin", "nyc.js"));

  let coveralls = getCreateProjectDependencies(projectPath, path.join("coveralls", "bin", "coveralls.js"));

  let commandText = `"${nyc}" mocha -t 5000 && "${nyc}" report --reporter=text-lcov | "${coveralls}"`;

  let res = execSync(commandText, { encoding: "utf-8", cwd: projectPath });

  unlinkSync(nycrcFile);

  printMessage("覆盖率完成");
}
