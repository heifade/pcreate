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
    let targetFile = fsi.getFileName(subPath); // 获取目录名称

    let targetPath = `${rootPath}/es/template`;
    targetFile = `${targetPath}/${targetFile}.zip`;

    await fsi.mkdir(targetPath);
    await zipi.zipPath(subPath, targetFile);
  }
}

run()
  .then()
  .catch();
