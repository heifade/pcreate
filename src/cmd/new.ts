import { Argv } from "yargs";

export let command = "new <command>";
export let desc = "创建";
export let builder = (yargs: Argv) => {
  return yargs
    .commandDir("new")
    .describe("help", "显示帮助")
    .describe('version', '显示版本号')
};

export let handler = (argv: Argv) => {
  console.log('git');
};
