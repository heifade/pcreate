import { join as pathJoin } from "path";
import { GlobalData } from "../model/globalData";
import { readFileUtf8, saveFileUtf8Sync, existsSync } from "fs-i";

/**
 * 编辑package.json文件
 *
 * @export
 * @param {(json: any) => void} edit - 修改package.json里的对象json
 */
export async function editPackageJson(projectPath: string, edit: (json: any) => void) {
  await editFile(pathJoin(projectPath, "package.json"), fileContent => {
    let json = JSON.parse(fileContent);

    edit(json);

    return JSON.stringify(json, null, 2);
  });
}

/**
 * 编辑文件
 *
 * @export
 * @param {string} fileName - 文件名
 * @param {(fileContent: string) => string} edit - 修改文件内容并返回
 */
export async function editFile(fileName: string, edit: (fileContent: string) => string) {
  let fileContent = await readFileUtf8(fileName);

  fileContent = edit(fileContent);

  await saveFileUtf8Sync(fileName, fileContent);
}

/**
 * 获取构建程序所在目录
 *
 * @export
 * @returns
 */
export function getCreateProjectPath() {
  return pathJoin(__dirname, "..", "..");
}

/**
 * 获取构建程序所用到的工具
 *
 * @export
 * @param {string} projectPath
 * @param {string} url
 */
export function getCreateProjectDependencies(projectPath: string, url: string) {
  let cmd = pathJoin(getCreateProjectPath(), "node_modules", url);
  if (!existsSync(cmd)) {
    cmd = pathJoin(projectPath, "node_modules", url);
  }
  return cmd;
}
