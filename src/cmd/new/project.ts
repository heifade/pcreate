import { Argv, Arguments } from "yargs";
import { MainProj } from "./project/mainProj";

export let command = "project";
export let desc = "创建项目";
export let builder = (yargs: Argv) => {
  return yargs
};

export let handler = async (argv: Argv) => {
  let mainProj = new MainProj();
  await mainProj.run();
};
