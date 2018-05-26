import { Argv, Arguments } from "yargs";
import { MainProj } from "./project/mainProj";
import * as path from "path";

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
  let tpath: string;
  if (yargs.p) {
    tpath = path.resolve(yargs.p);
  } else {
    tpath = process.cwd();
  }
  await mainProj.run(tpath);
};
