import * as path from "node:path";
import { DefinePlugin } from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

module.exports = {
    mode: process.env["NODE_ENV"] === "production" ? "production" : "development",
    entry: "./src/main.ts",
    output: {
        path: path.join(__dirname, "../dist/web"),
        filename: "main.js",
        chunkFormat: "array-push",
        hashFunction: "sha256"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
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
        new DefinePlugin({
            SERVER_URL: "\"" + (process.env["SERVER_URL"] ?? "http://localhost:8080") + "\""
        }),
        new HtmlWebpackPlugin({
            template: "index.html",
            favicon: "favicon.ico",
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            template: "404.html",
            favicon: "favicon.ico",
            inject: false,
            filename: "404.html"
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "./assets",
                    to: "assets"
                }
            ]
        })
    ]
};
