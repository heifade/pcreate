import { asyncExec } from "../tools/asyncExec";
import { ProjectConfigModel } from "pcreate-config";
import { CompileModel } from "pcreate-config";
import { getCreateProjectDependencies } from "./util";
import * as path from "path";
import { writeFileSync, unlinkSync } from "fs";
import { isArray, isObject } from "lodash";

export async function compile(projectPath: string, projectConfig: ProjectConfigModel) {
  let compile: any = projectConfig.compile;
  if (!compile) {
    return;
  }
  if (isArray(compile)) {
    for (let c of compile) {
      await compileWithCompileModel(c, projectConfig.sourceInclude, projectPath);
    }
  } else if (isObject(compile)) {
    await compileWithCompileModel(compile, projectConfig.sourceInclude, projectPath);
  }
}

async function compileWithCompileModel(compile: CompileModel, sourceInclude: string[], projectPath: string) {
  // let pars: Array<string> = [];
  // addPar(pars, "rootDir", projectPath);
  // // addPar(pars, "outDir", compile.outDir);
  // addPar(pars, "outDir", '/Volumes/RamDisk/Github/p1/lib');
  // addPar(pars, "target", compile.target);
  // addPar(pars, "module", compile.module);
  // addPar(pars, "allowJs", compile.allowJs);
  // addPar(pars, "declaration", compile.declaration);
  // addPar(pars, "sourceMap", compile.sourceMap);
  // addPar(pars, "noImplicitAny", compile.noImplicitAny);

  // // let tsc = getCreateProjectDependencies(projectPath, path.join("typescript", "bin", "tsc"));

  // // console.log(1, pars, projectPath);

  // // await asyncExec("tsc", pars, {
  // //   cwd: projectPath
  // // });

  let json: any = {
    compilerOptions: {
      outDir: compile.outDir,
      target: compile.target,
      module: compile.module,
      allowJs: compile.allowJs,
      declaration: compile.declaration,
      sourceMap: compile.sourceMap,
      noImplicitAny: compile.noImplicitAny,
      removeComments: true,
      lib: compile.lib,
      types: ["node"]
    },
    include: sourceInclude
  };

  let tsConfigFile = path.join(projectPath, `tsconfig.json`);

  let tsConfigText = JSON.stringify(json, null, 2);

  writeFileSync(tsConfigFile, tsConfigText);

  

  await asyncExec("tsc", ["-p", 'tsconfig.json']);

  unlinkSync(tsConfigFile);
}

// function addPar(pars: Array<string>, key: string, value: any) {
//   if (value) {
//     pars.push(`--${key}`);
//     pars.push(value);
//   }
// }
