import { Configuration, optimize } from "webpack";
import { resolve as pathResolve } from "path";

let config: Configuration = {
  entry: {
    index: "./src/index.ts"
  },
  output: {
    // path: pathResolve(__dirname, "es"),
    filename: "./es/[name].js"
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
  plugins: [
    new optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false
      }
    })
  ]
};

export default config;
