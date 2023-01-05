import * as path from "node:path";
import { Configuration, DefinePlugin } from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config: Configuration = {
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
                    from: "./src/assets",
                    to: "assets"
                }
            ]
        })
    ]
};

if (process.env["NODE_ENV"] === "production") {
    config.mode = "production";
    config.devtool = false;
    config.plugins?.push(new DefinePlugin({
        SERVER_URL: "\"http://pi.joeyshi.com:3141\""
    }));
} else {
    config.mode = "development";
    config.devtool = "source-map";
    config.plugins?.push(new DefinePlugin({
        SERVER_URL: "\"http://localhost:8080\""
    }));
}

export default config;
