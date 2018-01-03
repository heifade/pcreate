import { iBuilder } from "./iBuilder";
import * as path from "path";
import { IProjectConfig } from "../../model/IProjectConfig";
import { readPackageJson } from "../../tools/readPackageJson";
import { mkdirs } from "fs-i/es";
import { writeFileSync } from "fs";
import { editPackageJson, getCreateProjectPath } from "../../common/util";
import { asyncExec } from "../../tools/asyncExec";
import { format } from "typedoc-format";
import { printMessage } from "../../common/log";

export class NodeBuilder implements iBuilder {
  public async run(projectPath: string, projectConfig: IProjectConfig) {
    printMessage("正在将TypeScript编译成JavaScript...");
    await asyncExec("tsc", ["-p", projectPath]);

    let packageJson = await readPackageJson(path.join(projectPath, "package.json"));

    if (projectConfig.command) {
      await this.addCommand(projectPath, packageJson.name, projectConfig);
    }

    if (projectConfig.documents) {
      await this.buildDocs(projectPath);
    }
  }

  private async addCommand(projectPath: string, projectName: string, projectConfig: IProjectConfig) {
    printMessage("正在将程序处理成命令行...");

    // package.json
    await editPackageJson(projectPath, json => {
      if (typeof projectConfig.command === "boolean") {
        Object.assign(json, {
          bin: {
            [projectName]: `./es/bin/${projectName}`
          }
        });
      } else if (typeof projectConfig.command === "string") {
        Object.assign(json, {
          bin: {
            [projectConfig.command]: `./es/bin/${projectName}`
          }
        });
      } else if (projectConfig.command instanceof Array) {
        let binNode: any = {};
        projectConfig.command.map(c => {
          binNode[c] = `./es/bin/${projectName}`;
        });

        Object.assign(json, {
          bin: binNode
        });
      }
    });

    // bin
    let binPath = path.join(projectPath, "es", "bin");
    await mkdirs(binPath);

    writeFileSync(
      path.join(binPath, `${projectName}`),
      `
#!/usr/bin/env node
module.exports = require('../');
      `.trim()
    );

    writeFileSync(
      path.join(binPath, `${projectName}.cmd`),
      `
@IF EXIST "%~dp0\\node.exe" (
  "%~dp0\\node.exe"  "%~dp0\\..\\${projectName}\\bin\\${projectName}" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\\..\\${projectName}\\bin\\${projectName}" %*
)
      `.trim()
    );
  }

  private async buildDocs(projectPath: string) {
    printMessage("正在生成文档...");
    let docs = path.join(projectPath, "docs");
    let src = path.join(projectPath, "src");
    let typedoc = path.join(getCreateProjectPath(), "node_modules", "typedoc", "bin", "typedoc");
    await asyncExec(typedoc, ["--out", docs, src, "--module", "commonjs", "--hideGenerator"]);

    await format(docs);
  }
}
