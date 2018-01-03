import { Argv, Arguments } from "yargs";
import { iBuilder } from "./build/iBuilder";
import { readFileUtf8Sync, rmdirSync } from "fs-i";
import * as path from "path";
import { readProjectConfig } from "../tools/readProjectConfig";
import { NodeBuilder } from "./build/nodeBuilder";
import { printMessage, printSuccessMessage } from "../common/log";

export let command = "build";
export let desc = "构建项目";
export let builder = (yargs: Argv) => {
  return yargs;
};

export let handler = async (argv: Argv) => {
  printMessage("构建开始...");

  let builder: iBuilder = null;

  // let projectPath = "/Volumes/RamDisk/Github/p1";

  let projectPath = process.cwd();

  let configFileName = `${projectPath}/project-config.ts`;

  let projectConfig = await readProjectConfig(configFileName);

  rmdirSync(path.join(projectPath, "./es"));
  rmdirSync(path.join(projectPath, "./docs"));

  switch (projectConfig.projectType) {
    case "node":
      builder = new NodeBuilder();
      break;
  }

  await builder.run(projectPath, projectConfig);

  printSuccessMessage("构建完成");
};
