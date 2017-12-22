import { Answer } from "./model/answer";
import { getAllFiles } from "fs-i";
import { readFileSync, writeFileSync, copySync, rmdirSync, emptyDirSync } from "fs-extra";

async function replaceProjectName(path: string, answer: Answer) {
  let files = await getAllFiles(path);

  for (let file of files) {
    let fileContent = readFileSync(file, { encoding: "utf-8" });
    fileContent = fileContent.replace(/{{projectName}}/g, answer.projectName);

    fileContent = await editPackageJson(file, fileContent, answer);

    writeFileSync(file, fileContent);
  }

  if (answer.unittest === "否") {
    let dir = path + "/test";
    emptyDirSync(dir);
    rmdirSync(dir);
  }
}

async function editPackageJson(file: string, fileContent: string, answer: Answer) {
  file = file.replace(/\\/g, "/");
  file = file.substr(file.lastIndexOf("/") + 1);

  if (file === "package.json") {
    if (answer.needDocs === "否") {
      let json = JSON.parse(fileContent);
      delete json.devDependencies.typedoc;
      delete json.scripts.docs;
      json.scripts.build = json.scripts.build.replace(/\s*&&\s*npm\s*run\s*docs\s*/, "");
      fileContent = JSON.stringify(json, null, 2);
    }

    if (answer.unittest === "否") {
      let json = JSON.parse(fileContent);
      delete json.devDependencies["@types/chai"];
      delete json.devDependencies["@types/mocha"];
      delete json.devDependencies["source-map-support"];
      delete json.devDependencies["ts-node"];
      delete json.devDependencies["typedoc-format"];
      delete json.devDependencies.chai;
      delete json.devDependencies.coveralls;
      delete json.devDependencies.mocha;
      delete json.devDependencies.nyc;
      delete json.scripts.test;
      delete json.scripts["test-nyc"];
      delete json.nyc;

      json.scripts.build = json.scripts.build.replace(/\s*&&\s*npm\s*run\s*docs\s*/, "");
      fileContent = JSON.stringify(json, null, 2);
    }
  }

  if (file == ".travis.yml") {
    if (answer.unittest === "否") {
      fileContent = fileContent.replace(/(script\s*:)((.|\n)*?)(\s*-\s*npm\s*run\s*test)/, function(w, a, b, c, d) {
        return w.replace(d, '');
      });
      fileContent = fileContent.replace(/(after_script\s*:)((.|\n)*?)(\s*-\s*npm\s*run\s*test-nyc)/, function(w, a, b, c, d) {
        return w.replace(a, '').replace(d, '');
      });
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
  // if (answer.unittest) {
  createProjectWithUnitTest(answer);
  // }
}
