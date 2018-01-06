import { Argv, Arguments } from "yargs";
import { iBuilder } from "./build/iBuilder";
import { rmdirSync } from "fs-i";
import * as path from "path";
import { readProjectConfig } from "../tools/readProjectConfig";
import { NodeBuilder } from "./build/nodeBuilder";
import { printMessage, printSuccessMessage, printErrorMessage } from "../common/log";
import { projectConfigFile } from "../common/const";
import { getCreateProjectDependencies } from "../common/util";
import { spawn, execFile, execFileSync, exec } from "child_process";

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

export let handler = (yargs: any) => {
  printMessage("单元测试开始...");

  let projectPath = path.resolve(yargs.p) || process.cwd();

  let nyc = getCreateProjectDependencies(projectPath, path.join("nyc", "bin", "nyc.js"));
  let mocha = getCreateProjectDependencies(projectPath, path.join("mocha", "bin", "mocha"));

  let childProcess = spawn(nyc, [mocha, "-t", "5000"], {
    cwd: projectPath,
    stdio: [process.stdin, process.stdout, process.stderr]
  });

  childProcess.on("exit", code => {
    printMessage("单元测试结束");
    if (code != 0) {
      process.exit(code);
    }
  });

  exec(`"${nyc}" report --reporter=text-lcov | coveralls`, { encoding: "utf-8" }, (err, stdout, stderr) => {
    if (err) {
      process.exit(1);
    } else {
      printMessage("覆盖率完成" + stdout);
    }
  });
};
