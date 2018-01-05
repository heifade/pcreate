import { spawn, SpawnOptions } from "child_process";

export async function asyncExec(cmd: string, args?: string[], options?: SpawnOptions) {
  return new Promise<string>((resolve, reject) => {
    let childProcess = spawn(cmd, args, options);
    let resultMessage = "";

    childProcess.stdout.on("data", data => {
      resultMessage += data + "\n";
    });

    childProcess.stderr.on("data", data => {
      resultMessage += data + "\n";
    });

    childProcess.on("close", code => {
      if (code == 0) {
        resolve(resultMessage.trim());
      } else {
        reject(resultMessage.trim());
      }
    });
  });
}


