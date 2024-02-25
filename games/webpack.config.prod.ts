import { DefinePlugin } from "webpack";
import { commonConfig } from './webpack.config.common';

module.exports = {
    ...commonConfig,
    mode: "production",
    plugins: [
        new DefinePlugin({
            SERVER_URL: "\"https://play.joeyshi.xyz\""
        })
    ]
};
