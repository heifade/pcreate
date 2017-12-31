import * as path from "path";
import { GlobalData } from "../model/globalData";
import { readFileUtf8 } from "fs-i/es";
import { writeFileSync } from "fs";

export async function editPackageJson(edit: (json: any) => void) {
  await editFile(path.join(GlobalData.projectRootPath, "package.json"), fileContent => {
    let json = JSON.parse(fileContent);

    edit(json);

    return JSON.stringify(json, null, 2);
  });
}

export async function editFile(fileName: string, edit: (fileContent: string) => string) {
  let fileContent = await readFileUtf8(fileName);

  fileContent = edit(fileContent);

  await writeFileSync(fileName, fileContent);
}
