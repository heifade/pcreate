import * as webpack from "webpack";
import * as path from "path";

let config: webpack.Configuration = {
  entry: {
    index: "./src/index.ts"
  },
  output: {
    path: path.resolve(__dirname, "es"),
    filename: "[name].js"
  },
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader" }]
  },
  target: "node",
  resolve: {
    extensions: [".ts", ".js"]
  },
  externals: {
    // "fs-extra": "require('fs-extra')"
  }
};

export default config;
