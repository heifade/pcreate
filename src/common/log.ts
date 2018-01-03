import chalk from "chalk";

/**
 * 输出普通消息
 *
 * @export
 * @param {string} msg
 */
export function printMessage(msg: string) {
  console.log(chalk.white(msg));
}

/**
 * 输出成功消息
 *
 * @export
 * @param {string} msg
 */
export function printSuccessMessage(msg: string) {
  console.log(chalk.green(msg));
}

/**
 * 输出失败消息
 *
 * @export
 * @param {string} msg
 */
export function printErrorMessage(msg: string) {
  console.log(chalk.red(msg));
}
