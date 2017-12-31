import { Argv } from "yargs";

export let command = "commit";
export let desc = "commit repo local";
export let builder = (yargs: Argv) => {
  return yargs
    .describe("help", "显示帮助")
    .describe('version', '显示版本号')
};

export let handler = (argv: Argv) => {
  console.log('commit');
};
