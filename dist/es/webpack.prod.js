"use strict";
/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'production';
const favicons_webpack_plugin_1 = __importDefault(require("favicons-webpack-plugin"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const webpack_subresource_integrity_1 = __importDefault(require("webpack-subresource-integrity"));
// import ExtractTextPlugin from 'extract-text-webpack-plugin'
const webpack_common_1 = __importDefault(require("./webpack.common"));
const configuration = webpack_merge_1.default(webpack_common_1.default, {
    bail: true,
    devtool: 'source-map',
    mode: 'production',
    module: {
        rules: [
            {
                oneOf: [
                    {
                        exclude: /node_modules/,
                        test: /\.tsx?$/,
                        use: 'babel-loader',
                    },
                    {
                        exclude: /node_modules/,
                        include: /node_modules\/@manuscripts\/(?!(manuscripts-json-schema|assets)\/)/,
                        test: /\.jsx?$/,
                        use: 'babel-loader',
                    },
                    {
                        test: /pdfjs-dist.+.js$/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                'presets': ['@babel/preset-env'],
                                cacheDirectory: true,
                            },
                        },
                    },
                    {
                        test: /\.mjs$/,
                        type: 'javascript/auto',
                    },
                    {
                        test: /\.css$/,
                        // use: ExtractTextPlugin.extract({
                        //   fallback: 'style-loader',
                        //   use: 'css-loader',
                        // }),
                        use: ['style-loader', 'css-loader'],
                    },
                    {
                        test: /\.(png|jpg|gif|xml)$/,
                        use: {
                            loader: 'file-loader',
                            options: {
                                name: 'files/[name].[hash:8].[ext]',
                            },
                        },
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/,
                        use: {
                            loader: 'file-loader',
                            options: {
                                name: 'fonts/[name].[hash:8].[ext]',
                            },
                        },
                    },
                ],
            },
        ],
    },
    output: {
        chunkFilename: 'js/[name].[chunkhash:8].js',
        filename: 'js/[name].[chunkhash:8].js',
        crossOriginLoading: 'anonymous',
    },
    performance: {
        hints: 'error',
        maxEntrypointSize: 1024 * 1024,
        maxAssetSize: 10 * 1024 * 1024,
    },
    plugins: [
        new webpack_subresource_integrity_1.default({
            hashFuncNames: ['sha512'],
        }),
        new favicons_webpack_plugin_1.default({
            logo: './public/favicon.png',
            cache: true,
            prefix: 'webapp/[hash:8]',
            inject: true,
            favicons: {
                appName: 'Manuscripts.io',
                appShortName: 'Manuscripts',
                developerName: null,
                developerURL: null,
                version: undefined,
                background: '#fff',
                theme_color: '#fff',
                icons: {
                    android: true,
                    appleIcon: true,
                    appleStartup: false,
                    favicons: true,
                    firefox: true,
                    windows: true,
                },
            },
        }),
        // new ExtractTextPlugin({
        //   allChunks: true,
        //   // filename: '[name].[contenthash].css',
        // }),
    ],
});
exports.default = configuration;
//# sourceMappingURL=webpack.prod.js.map