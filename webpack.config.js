const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); // Import Copy Plugin

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    mode: "development",
    devServer: {
        static: "./dist",
        port: 1024, // Set the port
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html",
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/assets", to: "assets" }, // Copy assets folder
            ],
        }),
    ],
};
