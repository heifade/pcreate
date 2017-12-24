let fs = require("fs-extra");
let zipi = require("zip-i");

fs.copySync("./src/bin", "./es/bin");
zipi.zipPath(`${__dirname}/../template`, `${__dirname}/../es/template.zip`);
