import * as path from "node:path";
import { Configuration } from "webpack";

export function buildConfig(mode: "development" | "production"): Configuration {
    return {
        mode,
        entry: {
            "platform-party": "./src/platform-party/main.ts",
            "snake": "./src/snake/main.ts"
        },
        output: {
            path: path.join(__dirname, "../../public/web"),
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
}
