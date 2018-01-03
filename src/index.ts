import { commandDir } from "yargs";
import chalk from "chalk";
import { TemplateData } from "./common/template";
import * as path from "path";

TemplateData.setPath(path.join(__dirname, "template"));

commandDir("cmd")
  .demandCommand(1, chalk.red("请输入子命令!"))
  .describe("help", "显示帮助")
  .describe("version", "显示版本号")
  .locale("en")
  .usage("Usage: $0 <command> [options]").argv;

process.on("SIGINT", function() {
  process.exit(0);
});
