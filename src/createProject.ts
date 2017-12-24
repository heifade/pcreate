// import { Answer } from "./model/answer";
// import { getAllFiles } from "fs-i";
// import { readFileSync, writeFileSync, copySync, rmdirSync, emptyDirSync } from "fs-extra";




// async function editPackageJson(file: string, fileContent: string, answer: Answer) {
//   file = file.replace(/\\/g, "/");
//   file = file.substr(file.lastIndexOf("/") + 1);

//   if (file === "package.json") {
//     if (answer.needDocs === "否") {
//       let json = JSON.parse(fileContent);
//       delete json.devDependencies.typedoc;
//       delete json.scripts.docs;
//       json.scripts.build = json.scripts.build.replace(/\s*&&\s*npm\s*run\s*docs\s*/, "");
//       fileContent = JSON.stringify(json, null, 2);
//     }

//     if (answer.unittest === "否") {
//       let json = JSON.parse(fileContent);
//       delete json.devDependencies["@types/chai"];
//       delete json.devDependencies["@types/mocha"];
//       delete json.devDependencies["source-map-support"];
//       delete json.devDependencies["ts-node"];
//       delete json.devDependencies["typedoc-format"];
//       delete json.devDependencies.chai;
//       delete json.devDependencies.coveralls;
//       delete json.devDependencies.mocha;
//       delete json.devDependencies.nyc;
//       delete json.scripts.test;
//       delete json.scripts["test-nyc"];
//       delete json.nyc;

//       fileContent = JSON.stringify(json, null, 2);
//     }
//   }

//   if (file == ".travis.yml") {
//     if (answer.unittest === "否") {
//       fileContent = fileContent
//         .replace(/(script\s*:)((.|\n)*?)(\s*-\s*npm\s*run\s*test)/, (w, a, b, c, d) => {
//           return w.replace(d, "");
//         })
//         .replace(/(after_script\s*:)((.|\n)*?)(\s*-\s*npm\s*run\s*test-nyc)/, (w, a, b, c, d) => {
//           return w.replace(a, "").replace(d, "");
//         })
//         .replace(/(-\s*provider:\s*pages\s*)([^-]*)/, "");
//     }
//   }

//   return fileContent;
// }


