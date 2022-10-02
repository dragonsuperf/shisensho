"use strict";
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "development",
    entry: './src/index.ts',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "./dist")
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
              test: /\.css$/i,
              use: ['style-loader', 'css-loader'],
            },
            {
              test: /\.(png|svg|jpg|jpeg|gif)$/i,
              type: 'asset/resource',
            },
            {
              test: /\.(woff|woff2|eot|ttf|otf)$/i,
              type: 'asset/resource',
            }
        ],
    },
    plugins: [
      new HTMLWebpackPlugin({
        filename: "./index.html",
        template: path.join(__dirname, 'public/index.html')
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.swcMinify,
          // `terserOptions` options will be passed to `swc` (`@swc/core`)
          // Link to options - https://swc.rs/docs/config-js-minify
          terserOptions: {},
        }),
      ],
    },
};