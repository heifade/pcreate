import { Argv, Arguments } from "yargs";
import { iBuilder } from "./build/iBuilder";
import { rmdirSync } from "fs-i";
import * as path from "path";
import { readProjectConfig } from "../tools/readProjectConfig";
import { NodeBuilder } from "./build/nodeBuilder";
import { printMessage, printSuccessMessage, printErrorMessage } from "../common/log";
import { projectConfigFile } from "../common/const";
import { asyncExec } from "../tools/asyncExec";
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

  let projectPath = path.resolve(yargs.p) || process.cwd();

  let nyc = getCreateProjectDependencies(projectPath, path.join("nyc", "bin", "nyc.js"));
  let mocha = getCreateProjectDependencies(projectPath, path.join("mocha", "bin", "mocha"));

  // let ch = spawn(nyc, [mocha, "-t", "5000"], {
  //   cwd: projectPath,
  //   stdio: ["inherit", "inherit", "inherit"]
  // });

  // try {
  //   let ch = spawn(mocha, ["-t", "5000"], {
  //     cwd: projectPath,
  //     stdio: ["inherit", "inherit", "inherit"]
  //   });
  // }
  // catch(e) {
  //   console.log('error', e);
  // }

  try {
    await new Promise((resolve, reject) => {
      execFile(nyc, [mocha, "-t", "5000"], { cwd: projectPath, encoding: "utf-8" }, (err, stdout, stderr) => {
        if (err) {
          console.log(stdout);
          reject(stdout);
        } else {
          console.log(stdout);
          resolve(stdout);
        }
      });
    });
    return 0;
  }
  catch(e) {
    return 1;
  }
  

  // ch.stdout.on('data', data => {
  //   console.log('data', (data as Buffer).toString('utf-8'));
  // });
  // ch.stderr.on('data', data => {
  //   console.log('err', (data as Buffer).toString('utf-8'));
  // });

  // await asyncExec(mocha, [], { cwd: projectPath });

  // try {
  //   let builder: iBuilder = null;

  //   let projectPath = path.resolve(yargs.p) || process.cwd();

  //   let configFileName = path.join(projectPath, projectConfigFile);

  //   let projectConfig = await readProjectConfig(configFileName);

  //   rmdirSync(path.join(projectPath, "./es"));
  //   rmdirSync(path.join(projectPath, "./docs"));

  //   switch (projectConfig.projectType) {
  //     case "node":
  //       builder = new NodeBuilder();
  //       break;
  //   }

  //   await builder.run(projectPath, projectConfig);

  //   printSuccessMessage("构建完成");
  // } catch (e) {
  //   printErrorMessage(`${e}\n构建失败！`);
  // }
};
