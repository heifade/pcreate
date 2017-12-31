import { Argv } from "yargs";

export let command = "git <command>";
export let desc = "github command list";
export let builder = (yargs: Argv) => {
  return yargs
    .commandDir("git")
    .describe("help", "显示帮助")
    .describe('version', '显示版本号')
};

export let handler = (argv: Argv) => {
  console.log('git');
};
