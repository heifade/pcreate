import { Argv, Arguments } from "yargs";
import { iBuilder } from "./build/iBuilder";
import { rmdirSync } from "fs-i";
import { join as pathJoin, resolve as pathResolve } from "path";
import { readProjectConfig } from "../tools/readProjectConfig";
import { NodeBuilder } from "./build/nodeBuilder";
import { printMessage, printSuccessMessage, printErrorMessage } from "../common/log";
import { projectConfigFile } from '../common/const';
import { readPackageJson } from "../tools/readPackageJson";

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

async function readPackage(index: number, projectPath: string) {
  let packageJson = await readPackageJson(pathJoin(projectPath, "package.json"));
  console.log('build1,package.json', JSON.stringify(packageJson));
}

export let handler = async (yargs: any) => {
  printMessage("构建开始...");

  

  try {
    let builder: iBuilder = null;

    let projectPath = pathResolve(yargs.p) || process.cwd();
    let configFileName = pathJoin(projectPath, projectConfigFile);

    readPackage(1, projectPath);

    let projectConfig = await readProjectConfig(configFileName);

    rmdirSync(pathJoin(projectPath, "./lib"));
    rmdirSync(pathJoin(projectPath, "./es"));
    rmdirSync(pathJoin(projectPath, "./docs"));

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
