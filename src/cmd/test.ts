import { Argv, Arguments } from "yargs";
import { iBuilder } from "./build/iBuilder";
import { rmdirSync } from "fs-i";
import { join as pathJoin, resolve as pathResolve} from "path";
import { readProjectConfig } from "../tools/readProjectConfig";
import { NodeBuilder } from "./build/nodeBuilder";
import { printMessage, printSuccessMessage, printErrorMessage } from "../common/log";
import { projectConfigFile } from "../common/const";
import { getCreateProjectDependencies } from "../common/util";
import { spawnSync, SpawnSyncOptionsWithStringEncoding, execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { ProjectConfigModel } from "pcreate-config";

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
  let projectPath = pathResolve(yargs.p) || process.cwd();
  let configFileName = pathJoin(projectPath, projectConfigFile);
  let projectConfig = await readProjectConfig(configFileName);

  if (projectConfig.unitTest) {
    let mochapars = getMochapars(yargs.mochapars); //解析给mocha传的参数
    let nycrcFile = createNycrcFile(projectPath); //创建 .nycrc文件
    test(projectPath, mochapars); //单元测试
    coveralls(projectPath, mochapars); //覆盖率
    unlinkSync(nycrcFile); //删除 .nycrc文件
  }
};

function getMochapars(mochapars: string) {
  let pars: string[] = [];

  if (mochapars) {
    console.log(`mocha参数：${mochapars}`);

    mochapars.split(",").map(p => {
      let kv = p.split("=");
      pars.push(`--${kv[0]}`);
      pars.push(`${kv[1]}`);
    });
  }
  return pars;
}

// 创建 .nycrc文件
function createNycrcFile(projectPath: string) {
  let nycrcFile = pathJoin(projectPath, ".nycrc");

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
  return nycrcFile;
}

function test(projectPath: string, mochapars: string[]) {
  printMessage("单元测试开始...");

  let nyc = getCreateProjectDependencies(projectPath, pathJoin("nyc", "bin", "nyc.js"));
  let mocha = getCreateProjectDependencies(projectPath, pathJoin("mocha", "bin", "mocha"));

  let options: SpawnSyncOptionsWithStringEncoding = {
    encoding: "utf8",
    cwd: projectPath,
    stdio: [process.stdin, process.stdout, process.stderr]
  };

  printMessage(`执行命令：${nyc} ${mocha} ${mochapars.join(" ")}`);

  let childProcess = spawnSync(nyc, [mocha].concat(mochapars), options);

  if (childProcess.status !== 0) {
    printErrorMessage(childProcess.error.message);
    printErrorMessage("单元测试不通过！");
    process.exit(childProcess.status);
    return;
  }

  printMessage("单元测试成功结束");
}

function coveralls(projectPath: string, mochapars: string[]) {
  printMessage("覆盖率开始...");

  let nyc = getCreateProjectDependencies(projectPath, pathJoin("nyc", "bin", "nyc.js"));

  let coveralls = getCreateProjectDependencies(projectPath, pathJoin("coveralls", "bin", "coveralls.js"));

  let commandText = `"${nyc}" mocha ${mochapars.join(" ")} && "${nyc}" report --reporter=text-lcov | "${coveralls}"`;

  printMessage(`执行命令：${commandText}`);

  let res = execSync(commandText, { encoding: "utf-8", cwd: projectPath });

  printMessage("覆盖率完成");
}
