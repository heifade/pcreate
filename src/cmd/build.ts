import { Argv, Arguments } from "yargs";
import { iBuilder } from "./build/iBuilder";
import { readFileUtf8Sync } from "fs-i/es";
import * as path from 'path';

export let command = "build";
export let desc = "构建项目";
export let builder = (yargs: Argv) => {
  return yargs
};

export let handler = async (argv: Argv) => {

  let builder: iBuilder = null;

  let projectPath = '/Volumes/RamDisk/Github/p1';

  //let projectConfig = readFileUtf8Sync();

  // console.log(projectPath);

  let pp = require(path.join(projectPath, 'project-config.ts'))

  console.log(11, pp);





  // builder.run();
  
};
