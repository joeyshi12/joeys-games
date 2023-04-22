import * as path from "node:path";
import { Configuration } from "webpack";
const CopyPlugin = require("copy-webpack-plugin");

const config: Configuration = {
    entry: "./src/server.ts",
    target: "node",
    mode: "development",
    output: {
        path: path.join(__dirname, "./dist"),
        filename: "server.js",
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
    externals: [
        {
            "utf-8-validate": "commonjs utf-8-validate",
            bufferutil: "commonjs bufferutil"
        },
    ],
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "./data",
                    to: "data"
                }
            ]
        })

    ]
};

export default config;
