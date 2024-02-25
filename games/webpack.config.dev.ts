import { DefinePlugin } from "webpack";
import { commonConfig } from './webpack.config.common';

module.exports = {
    ...commonConfig,
    mode: "development",
    plugins: [
        new DefinePlugin({
            SERVER_URL: "\"http://localhost:8080\""
        })
    ]
};
