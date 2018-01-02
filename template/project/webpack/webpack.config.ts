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
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["es2015"]
            }
          },
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  target: "node",
  resolve: {
    extensions: [".ts", ".js"]
  },
  externals: {
    "fs-extra": "require('fs-extra')"
  },

  plugins: [
    // 构建优化插件
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "v",
    //   filename: "v.min.js"
    // }),
    //
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false
      }
    })
  ]
};

export default config;
