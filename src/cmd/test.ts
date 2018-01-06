import { Argv, Arguments } from "yargs";
import { iBuilder } from "./build/iBuilder";
import { rmdirSync } from "fs-i";
import * as path from "path";
import { readProjectConfig } from "../tools/readProjectConfig";
import { NodeBuilder } from "./build/nodeBuilder";
import { printMessage, printSuccessMessage, printErrorMessage } from "../common/log";
import { projectConfigFile } from "../common/const";
import { getCreateProjectDependencies } from "../common/util";
import { spawn, execFile, execFileSync } from "child_process";

export let command = "test";
export let desc = "测试项目";
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
  printMessage("测试开始...");

  return new Promise((resolve, reject) => {
    let projectPath = path.resolve(yargs.p) || process.cwd();

    let nyc = getCreateProjectDependencies(projectPath, path.join("nyc", "bin", "nyc.js"));
    let mocha = getCreateProjectDependencies(projectPath, path.join("mocha", "bin", "mocha"));

    let ch = spawn(nyc, [mocha, "-t", "5000"], {
      cwd: projectPath,
      //stdio: [process.stdin, process.stdout, process.stderr]
      stdio: "pipe"
    });

    ch.on("exit", code => {
      process.exit(code);
    });
  });
};
