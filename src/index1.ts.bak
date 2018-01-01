import { command, usage, demand, option, options } from "yargs";
import { prompt, Questions } from "inquirer";
import { MainProj } from "./projects/mainProj";
import { GlobalData } from "./model/globalData";
import { ProjectType } from "./model/ProjectType";

// let argv = command("project", "创建项目", yargs => {
//   console.log(yargs);
//   return yargs;
// }).help('h');

command(
  "project",
  "创建项目",
  function(yargs) {
    return yargs.option("u", {
      alias: "url",
      demand: true,
      describe: "the URL to make an HTTP request to"
    });
  },
  function(argv) {
    console.log(argv.url);
  }
)
  .command(
    "set",
    "set 11",
    function(yargs) {
      return yargs.option("u", {
        alias: "url",
        demand: true,
        describe: "the URL to make an HTTP request to"
      });
    },
    function(argv) {
      console.log(argv.url);
    }
  )
  .argv;

// option("p", {
//   alias: "project",
//   demand: false,
//   // default: "是",
//   describe: "是否创建项目",
//   //choices: ["是", "否"],
//   type: "boolean"
// }).option("c", {
//   alias: "component",
//   demand: false,
//   describe: "是否创建组件",
//   type: "boolean"
// })
//   .usage("$0 -w [string] -")
//   .example("hello -n tom", "say hello to Tom")
//   .help("h")
//   .alias("h", "help")
//   .epilog("copyright 2015").argv;

async function run() {
  // let argv = command("project", "创建项目",  (yargs) => {
  //   console.log(yargs);
  //   return yargs;
  // });
  // console.log(argv.help().argv);
  // let mainProj = new MainProj();
  // await mainProj.run();
}

run()
  .then(() => {})
  .catch(err => {
    console.log(err);
  });

process.on("SIGINT", function() {
  process.exit(0);
});
