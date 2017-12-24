import { command, Argv } from "yargs";
import { prompt, Questions } from "inquirer";
import { NodeProj } from "./projects/nodeProj";
import { MainProj } from "./projects/mainProj";
import { Angular2Proj } from "./projects/angular2Proj";

async function run() {

  

  let mainProj = new MainProj();
  let nodeProj = new NodeProj();
  let angular2Proj = new Angular2Proj();

  await mainProj.run();
  await nodeProj.run();
  await angular2Proj.run();
}

run()
  .then(() => {})
  .catch(err => {
    console.log(err);
  });

process.on("SIGINT", function() {
  process.exit(0);
});
