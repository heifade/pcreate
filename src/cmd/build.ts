import { Argv, Arguments } from "yargs";
import { iBuilder } from "./build/iBuilder";
import { rmdirSync } from "fs-i";
import * as path from "path";
import { readProjectConfig } from "../tools/readProjectConfig";
import { NodeBuilder } from "./build/nodeBuilder";
import { printMessage, printSuccessMessage, printErrorMessage } from "../common/log";
import { projectConfigFile } from '../common/const';

export let command = "build";
export let desc = "构建项目";
export let builder = (yargs: Argv) => {
  return yargs
    .option("p", {
      alias: "path",
      describe: "构建的目录",
      default: ".",
      type: "string"
    })
    .usage("Usage: $0 build -p .");
};

export let handler = async (yargs: any) => {
  printMessage("构建开始...");

  try {
    let builder: iBuilder = null;

    let projectPath = path.resolve(yargs.p) || process.cwd();
    let configFileName = path.join(projectPath, projectConfigFile);
    let projectConfig = await readProjectConfig(configFileName);

    rmdirSync(path.join(projectPath, "./lib"));
    rmdirSync(path.join(projectPath, "./es"));
    rmdirSync(path.join(projectPath, "./docs"));

    switch (projectConfig.projectType) {
      case "node":
        builder = new NodeBuilder();
        break;
    }

    await builder.run(projectPath, projectConfig);

    printSuccessMessage("构建完成");
  } catch (e) {
    printErrorMessage(`${e}\n构建失败！`);
  }
};
