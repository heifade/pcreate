let fs = require("fs-extra");
let zipi = require("zip-i");
let fsi = require("fs-i");
let path = require("path");

/**
 * 复制IProjectConfig到template
 *
 */
async function copyIProjectConfig() {
  let rootPath = path.join(__dirname, "..");
  let templatePath = path.join(rootPath, "template");

  let subPathList = await fsi.getDirs(templatePath);

  for (let subPath of subPathList) {
    let subSubPathList = await fsi.getDirs(subPath);
    for (let subSubPath of subSubPathList) {
      let modelPath = path.join(subSubPath, "src", "model");
      let fileName = "IProjectConfig.ts";
      let projectConfigFile = path.join(modelPath, fileName);

      fsi.mkdirsSync(modelPath);
      fs.copyFileSync(path.join(rootPath, "src", "model", fileName), projectConfigFile);
    }
  }
}

/**
 * 从template/src中复制bin到template/es
 *
 */
async function copyBin() {
  fs.copySync("./src/bin", "./es/bin");
}

/**
 * 从template中复制到新项目
 *
 */
async function copyTemplate() {
  let rootPath = path.join(__dirname, "..");
  let templatePath = path.join(rootPath, "template");

  let subPathList = await fsi.getDirs(templatePath);

  for (let subPath of subPathList) {
    let subSubPathList = await fsi.getDirs(subPath);

    let targetPath = path.join(rootPath, "es", "template", path.basename(subPath));

    await fsi.mkdirs(targetPath);

    for (let subSubPath of subSubPathList) {
      let shortPathName = path.basename(subSubPath);

      let sourcePath = path.join(subPath, shortPathName);
      let targetZipFile = path.join(targetPath, `${shortPathName}.zip`);

      await zipi.zipPath(sourcePath, targetZipFile);
    }
  }
}

async function run(params) {
  console.log(1);
  await copyIProjectConfig();
  console.log(2);
  await copyBin();
  console.log(3);
  await copyTemplate();
  console.log(4);
}

run()
  .then()
  .catch();
