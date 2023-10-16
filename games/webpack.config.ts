import * as path from "node:path";
import { DefinePlugin } from "webpack";

let params;
if (process.env["NODE_ENV"] === "production") {
    params = {
        mode: "production",
        serverUrl: "https://play.joeyshi.xyz"
    };
} else {
    params = {
        mode: "development",
        serverUrl: "http://localhost:8080"
    };
}

module.exports = {
    mode: params.mode,
    entry: {
        "platform-party": "./src/platform-party/main.ts",
        "snake": "./src/snake/main.ts"
    },
    output: {
        path: path.join(__dirname, "../public/web"),
        filename: "js/[name].js",
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
            SERVER_URL: `"${params.serverUrl}"`
        })
    ]
};
