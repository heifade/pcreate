import { asyncExec } from "../tools/asyncExec";
import { ProjectConfigModel } from "pcreate-config";
import { CompileModel } from "pcreate-config";
import { getCreateProjectDependencies } from "./util";
import * as path from "path";
import { writeFileSync, unlinkSync } from "fs";

export async function compile(projectPath: string, projectConfig: ProjectConfigModel) {
  let compile = projectConfig.compile;
  if (!compile) {
    return;
  }

  if (compile instanceof CompileModel) {
    await compileWithCompileModel(compile, projectConfig.sourceInclude, projectPath);
  } else if (compile instanceof Array) {
    for (let c of compile) {
      await compileWithCompileModel(c, projectConfig.sourceInclude, projectPath);
    }
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
      lib: ["es2015"],
      types: ["node"]
    },
    include: sourceInclude
  };

  let tsConfigFile = path.join(projectPath, `tsconfig.json`);

  writeFileSync(tsConfigFile, JSON.stringify(json, null, 2));

  await asyncExec("tsc", ["-p", tsConfigFile]);

  unlinkSync(tsConfigFile);
}

// function addPar(pars: Array<string>, key: string, value: any) {
//   if (value) {
//     pars.push(`--${key}`);
//     pars.push(value);
//   }
// }
