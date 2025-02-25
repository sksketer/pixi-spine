const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/index.js", // Entry point for your app (JavaScript)
    output: {
        filename: "bundle.js", // Output bundled JavaScript file
        path: path.resolve(__dirname, "dist"), // Output directory
        clean: true, // Clean the dist folder before each build
    },
    mode: "development",
    devServer: {
        static: path.resolve(__dirname, "dist"), // Serve files from "dist" folder
        port: 1024, // Port number for dev server
        hot: true, // Enable Hot Module Replacement (HMR)
    },
    module: {
        rules: [
            {
                test: /\.css$/, // Apply to .css files
                use: ["style-loader", "css-loader"], // Load CSS into JavaScript
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "index.html"), // Point to the index.html at root level
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "css", to: "css" }, // Copy the entire css folder to dist
            ],
        }),
    ],
};
