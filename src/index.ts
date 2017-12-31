import { command, Argv } from "yargs";
import { prompt, Questions } from "inquirer";
import { MainProj } from "./projects/mainProj";
import { GlobalData } from "./model/globalData";
import { ProjectType } from "./model/ProjectType";

async function run() {
  let mainProj = new MainProj();

  await mainProj.run();
}

run()
  .then(() => {})
  .catch(err => {
    console.log(err);
  });

process.on("SIGINT", function() {
  process.exit(0);
});
