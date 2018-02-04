import * as path from "path";
import * as browserify from "browserify";
import { saveFileUtf8Sync, deleteFileSync, existsSync } from "fs-i";
import { ProjectConfigModel, CompileModel } from "pcreate-config";
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

        if (projectConfig.sourceInclude === undefined) {
          projectConfig.sourceInclude = ["./src/**/*"];
        }
        if (projectConfig.command === undefined) {
          projectConfig.command = false;
        }
        if (projectConfig.documents === undefined) {
          projectConfig.documents = false;
        }
        if (projectConfig.unitTest === undefined) {
          projectConfig.unitTest = false;
        }
        if (projectConfig.compile instanceof CompileModel) {
          initCompile(projectConfig.compile);
        } else {
          projectConfig.compile.map(m => {
            initCompile(m);
          });
        }

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

function initCompile(compile: CompileModel) {
  if (compile.noImplicitAny === undefined) {
    compile.noImplicitAny = true;
  }
  if (compile.sourceMap === undefined) {
    compile.sourceMap = true;
  }
  if (compile.target === undefined) {
    compile.target = "es5";
  }
  if (compile.declaration === undefined) {
    compile.declaration = true;
  }
  if (compile.allowJs === undefined) {
    compile.allowJs = false;
  }
}
