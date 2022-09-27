"use strict";

const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: './src/index.ts',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
        path: path.join(__dirname, "./build"),
        filename: "index.js"
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'pubilc'),
      },
      compress: true,
      port: 3003
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "swc-loader",
                }
            },
            {
              test: /\.html$/,
              use: [
                {
                  loader: "html-loader",
                  options: { minimize: true }
                }
              ]
            },
            {
                test: /\.css$/,
                use:[
                    "style-loader",
                    "css-loader",
                ]
            }
        ],
    },
    plugins: [
      new HTMLWebpackPlugin({
        filename: "./index.html",
        template: path.join(__dirname, 'public/index.html')
      })
    ]
};