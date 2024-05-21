import * as path from "node:path";

export const commonConfig = {
    entry: {
        "platform-party": "./src/platform-party/main.ts",
        "snake": "./src/snake/main.ts"
    },
    output: {
        path: path.join(__dirname, "../public/static"),
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
    }
};
