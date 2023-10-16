import * as path from "node:path";
import { Configuration } from "webpack";

const config: Configuration = {
    entry: "./src/server.ts",
    target: "node",
    mode: "development",
    output: {
        path: path.join(__dirname, "./public"),
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
    ]
};

export default config;
