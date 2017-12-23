import { command, Argv } from "yargs";

export async function subCommand() {
  return new Promise((resolve, reject) => {
    let subCmd = command("pc-node", "pc-node", (yargs: Argv) => {
      resolve(yargs);
      return yargs;
    }).argv;
  });
}
