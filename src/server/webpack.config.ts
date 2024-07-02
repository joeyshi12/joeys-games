import * as path from "node:path";
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = {
    entry: "./src/server.ts",
    target: "node",
    mode: "production",
    output: {
        path: path.join(__dirname, "../../public"),
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
        new NodemonPlugin({
            script: "../../public/server.js",
            delay: 1000,
            verbose: true,
            env: {
                PORT: 8080,
                DB_HOST: "0.0.0.0",
                DB_USER: "my_user",
                DB_NAME: "test",
                DB_PASS: "password"
            }
        })
    ]
};
