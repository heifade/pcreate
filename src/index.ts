import { usage, demand, option, options, commandDir, argv, count, Argv } from "yargs";

commandDir("index")
  // .demand(1)
  // .version('version')
  // .help('help')
  .describe('help', '显示帮助')
  .describe('version', '显示版本号')
  
  .locale("en")
  .showHelpOnFail(true, "Specify --help for available options").argv;

