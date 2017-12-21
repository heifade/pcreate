import { Answer } from "./model/answer";
import { getAllFiles } from "fs-i";
import { readFileSync, writeFileSync, copySync } from "fs-extra";

async function replaceProjectName(path: string, answer: Answer) {
  let files = await getAllFiles(path);

  for (let file of files) {
    let fileContent = readFileSync(file, { encoding: "utf-8" });
    fileContent = fileContent.replace(/{{projectName}}/g, answer.projectName);

    fileContent = await needDocs(file, fileContent, answer);

    writeFileSync(file, fileContent);
  }
}

async function needDocs(file: string, fileContent: string, answer: Answer) {
  if (!answer.needDocs) {
    file = file.replace(/\\/g, "/");
    file = file.substr(file.lastIndexOf("/"));
    if (file === "package.json") {
      let json = JSON.parse(fileContent);
      delete json.devDependencies.typedoc;
      delete json.scripts.docs;
    }
  }
  return fileContent;
}

export async function createProjectWithUnitTest(answer: Answer) {
  let targetPath = `${process.cwd()}/${answer.projectName}`;
  copySync(`${__dirname}/../template/projectWithUnitTest`, targetPath);

  replaceProjectName(targetPath, answer);
}

export async function createProject(answer: Answer) {
  if (answer.unittest) {
    createProjectWithUnitTest(answer);
  }
}
