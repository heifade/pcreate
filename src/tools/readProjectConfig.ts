import * as path from "path";
import * as browserify from "browserify";
import { createWriteStream, unlinkSync, existsSync } from "fs";
import { IProjectConfig } from "../model/IProjectConfig";
let tsify = require("tsify");

export async function readProjectConfig(configFileName: string) {
  return new Promise<IProjectConfig>((resolve, reject) => {
    if (!existsSync(configFileName)) {
      return reject(`缺少文件${configFileName}！`);
    }

    let targetFile = configFileName + Math.random() + ".js";
    try {
      let fileWriter = createWriteStream(targetFile);

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

        fileWriter.write(fileContent.substring(start, end));

        let file = require(targetFile);

        let projectConfig = (file.default || file) as IProjectConfig;

        resolve(projectConfig);
        unlinkSync(targetFile);
      });
    } catch (e) {
      if (existsSync(targetFile)) {
        unlinkSync(targetFile);
      }
      reject(e);
    }
  });
}
