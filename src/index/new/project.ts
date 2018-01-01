import { Argv } from "yargs";
import { MainProj } from "../../projects/mainProj";

export let command = "project";
export let desc = "创建项目";
export let builder = (yargs: Argv) => {
  return yargs
    .describe("help", "显示帮助")
    .describe('version', '显示版本号')
};

export let handler = async (argv: Argv) => {
  let mainProj = new MainProj();
  await mainProj.run();
};
