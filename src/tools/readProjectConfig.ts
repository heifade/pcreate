import * as path from "path";
import * as browserify from "browserify";
import { saveFileUtf8Sync, deleteFileSync, existsSync } from "fs-i";
import { ProjectConfigModel } from "pcreate-config";
let tsify = require("tsify");

export async function readProjectConfig(configFileName: string) {
  return new Promise<ProjectConfigModel>((resolve, reject) => {
    if (!existsSync(configFileName)) {
      return reject(`缺少文件${configFileName}！`);
    }

    let targetFile = configFileName + Math.random() + ".js";
    try {
      // browserify()
      //   .add(configName)
      //   .plugin("tsify", { noImplicitAny: true, target: "es6" })
      //   .bundle()
      //   .pipe(fileWriter)
      //   .on("finish", () => {
      //     let file = require(targetFile);

      //     resolve(file);

      //     unlinkSync(targetFile);
      //   });

      // 没找到更好的方法，这里麻烦，需要将编译生成的js文件第一行与最后一行去除掉
      let reader = browserify()
        .add(configFileName)
        .plugin(tsify, { noImplicitAny: true, target: "es6" })
        .bundle();

      let fileContent = "";
      reader.on("data", data => {
        fileContent += data;
      });
      reader.on("end", () => {
        fileContent = (fileContent || "").replace(/\r\n/g, "\n").trim();

        let start = fileContent.indexOf("\n");
        let end = fileContent.lastIndexOf("\n");

        saveFileUtf8Sync(targetFile, fileContent.substring(start, end));

        let file = require(targetFile);

        let projectConfig = (file.default || file) as ProjectConfigModel;

        resolve(projectConfig);
        deleteFileSync(targetFile);
      });
    } catch (e) {
      if (existsSync(targetFile)) {
        deleteFileSync(targetFile);
      }
      reject(e);
    }
  });
}
