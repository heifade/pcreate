let fs = require("fs-extra");
let zipi = require("zip-i");
let fsi = require("fs-i");
let path = require("path");

async function run(params) {
  fs.copySync("./src/bin", "./es/bin");

  let rootPath = path.join(__dirname, "..");

  let templatePath = path.join(rootPath, "template");

  let subPathList = await fsi.getDirs(templatePath);

  for (var subPath of subPathList) {
    let subSubPathList = await fsi.getDirs(subPath);

    let targetPath = path.join(rootPath, "es", "template", path.basename(subPath));

    await fsi.mkdirs(targetPath);

    for (var subSubPath of subSubPathList) {
      let shortPathName = path.basename(subSubPath);

      let sourcePath = path.join(subPath, shortPathName);
      let targetZipFile = path.join(targetPath, `${shortPathName}.zip`); //`${targetPath}/${targetFile}.zip`;

      await zipi.zipPath(sourcePath, targetZipFile);
    }
  }
}

run()
  .then()
  .catch();
