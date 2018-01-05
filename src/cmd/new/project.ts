import { Argv, Arguments } from "yargs";
import { MainProj } from "./project/mainProj";

export let command = "project";
export let desc = "创建项目";
export let builder = (yargs: Argv) => {
  return yargs
    .option("p", {
      alias: "path",
      describe: "项目创建的目录",
      default: ".",
      type: "string"
    })
    .usage("Usage: $0 new project -p .");
};

export let handler = async (yargs: any) => {
  let mainProj = new MainProj();
  await mainProj.run(yargs.p || process.cwd());
};
