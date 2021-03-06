import { iBuilder } from "./iBuilder";
import { join as pathJoin } from "path";
import { ProjectConfigModel } from "pcreate-config";
import { readPackageJson } from "../../tools/readPackageJson";
import { mkdirs, deleteFile } from "fs-i/es";
import { writeFileSync } from "fs";
import { editPackageJson, getCreateProjectDependencies } from "../../common/util";
import { asyncExec } from "../../tools/asyncExec";
import { printMessage } from "../../common/log";
import { compile } from "../../common/tsc";
import { format } from "typedoc-format";

export class NodeBuilder implements iBuilder {
  public async run(projectPath: string, projectConfig: ProjectConfigModel) {
    printMessage("正在将TypeScript编译成JavaScript...");

    await compile(projectPath, projectConfig);

    let packageJson = await readPackageJson(pathJoin(projectPath, "package.json"));

    if (projectConfig.command) {
      await this.addCommand(projectPath, packageJson.name, projectConfig);
    }

    if (projectConfig.documents) {
      await this.buildDocs(projectPath);
    }

    await this.removeDependencies(projectPath);
  }

  private async addCommand(projectPath: string, projectName: string, projectConfig: ProjectConfigModel) {
    printMessage("正在将程序处理成命令行...");

    // package.json
    await editPackageJson(projectPath, json => {
      if (typeof projectConfig.command === "boolean") {
        //当command为boolean时，此时值一定是true，因为上面已经判断过：false的不会进这里
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
    let binPath = pathJoin(projectPath, "es", "bin");
    await mkdirs(binPath);

    writeFileSync(
      pathJoin(binPath, `${projectName}`),
      `
#!/usr/bin/env node
module.exports = require('../');
      `.trim()
    );

    writeFileSync(
      pathJoin(binPath, `${projectName}.cmd`),
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
    let docs = pathJoin(projectPath, "docs");
    let src = pathJoin(projectPath, "src");
    let typedoc = getCreateProjectDependencies(projectPath, pathJoin("typedoc", "bin", "typedoc"));

    printMessage(`执行命令：${typedoc} --out ${docs} ${src} --module commonjs --hideGenerator --lib lib.es6.d.ts`);
    await asyncExec(typedoc, ["--out", docs, src, "--module", "commonjs", "--hideGenerator", "--lib", "lib.es6.d.ts"]);

    await format(docs);
  }

  private async removeDependencies(projectPath: string) {
    await editPackageJson(projectPath, json => {
      if (json.dependencies) {
        delete json.dependencies.pcreate;
      }
      if (json.devDependencies) {
        delete json.devDependencies.pcreate;
      }
    });
  }
}
