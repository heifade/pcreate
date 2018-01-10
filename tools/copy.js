let zipi = require("zip-i");
let fsi = require("fs-i");
let path = require("path");
let fs = require("fs");



/**
 * 从template/src中复制bin到template/es
 *
 */
async function copyBin() {
  //fsi.copySync("./src/bin", "./es/bin");
  fs.mkdirSync("./es");
  copySync("./src/bin", "./es/bin");
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
  await copyBin();
  await copyTemplate();
}

run()
  .then()
  .catch();






function copySync(sourceDir, targetDir, options) {
  if (fs.existsSync(sourceDir)) {
    if (fs.statSync(sourceDir).isDirectory()) {
      // 源是目录
      



      fs.mkdirSync(targetDir);

      

      fs.readdirSync(sourceDir).forEach(file => {
        let sourceFullName = path.join(sourceDir, file);
        let targetFullName = path.join(targetDir, file);

        copySync(sourceFullName, targetFullName, options);
      });
    } else {
      // 源是文件

      
      // 目标不存在
      fs.copyFileSync(sourceDir, targetDir);
    }
  } else {
    throw new Error(`${sourceDir} is not exists!`);
  }
}