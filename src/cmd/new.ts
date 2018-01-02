import { Argv, Arguments } from "yargs";
import chalk from 'chalk'

export let command = "new <command>";
export let desc = "创建";
export let builder = (yargs: Argv) => {
  return yargs
    .commandDir("new")
    .demandCommand(1, chalk.red("请输入子命令!"))
    .usage('Usage: $0 new <command> [options]')
};

export let handler = (argv: Argv) => {
  //console.log("git");
};
