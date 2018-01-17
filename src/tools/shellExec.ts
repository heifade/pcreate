import { exec as shellExec } from "shelljs";
import { printMessage, printErrorMessage } from "../common/log";

export function shellExecSync(command: string, cwd?: string) {
  try {
    printMessage(`执行命令：${command}`);
    let c = shellExec(command, { cwd, async: false });
    if (c.stderr) {
      printErrorMessage(c.stdout.toString());
      return false;
    }
    if (c.stdout) {
      printMessage(c.stdout.toString());
    }
    return true;
  } catch (e) {
    console.log(`shell.exec(${command})`, e);
    return false;
  }
}
