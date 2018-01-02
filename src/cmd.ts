import { usage, demand, option, options, commandDir, argv, count, Argv } from "yargs";
import chalk from 'chalk'

commandDir("cmd")
  .demandCommand(1, '请输入子命令!')
  // .version('version')
  // .help('help')
  .describe('help', '显示帮助')
  .describe('version', '显示版本号')
  
  .locale("en")
  // .showHelpOnFail(true, "请传入--help参数以提供帮助")
  // .fail((msg, err) => {
  //   console.log(chalk.red(msg));
  // })
  .argv;



  process.on("SIGINT", function() {
    process.exit(0);
  });