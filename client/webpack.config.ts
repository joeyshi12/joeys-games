import * as path from "node:path";
import { Configuration } from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const mode = process.env["NODE_ENV"] === "production"
  ? "production"
  : "development";

const config: Configuration = {
  mode: mode,
  entry: "./src/index.ts",
  output: {
    path: path.join(__dirname, "../dist/client"),
    filename: "index.js",
    chunkFormat: "array-push",
    hashFunction: "sha256"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader"
        }
      }
    ]
  },
  plugins: [
      new HtmlWebpackPlugin({
        template: "index.html",
        favicon: "favicon.ico"
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "./src/assets",
            to: "assets"
          }
        ]
      })
  ]
}

export default config;
