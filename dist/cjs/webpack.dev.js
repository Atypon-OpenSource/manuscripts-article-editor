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
process.env.NODE_ENV = 'development';
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const webpack_1 = __importDefault(require("webpack"));
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const webpackbar_1 = __importDefault(require("webpackbar"));
const webpack_common_1 = __importDefault(require("./webpack.common"));
const configuration = webpack_merge_1.default(webpack_common_1.default, {
    devServer: {
        contentBase: './dist',
        historyApiFallback: true,
        hot: true,
        open: true,
        noInfo: true,
        stats: 'minimal',
    },
    devtool: 'source-map',
    mode: 'development',
    module: {
        rules: [
            {
                oneOf: [
                    {
                        exclude: /node_modules/,
                        test: /\.tsx?$/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    cacheDirectory: true,
                                },
                            },
                        ],
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
                        use: ['style-loader', 'css-loader'],
                    },
                    {
                        test: /\.(png|jpg|gif)$/,
                        use: {
                            loader: 'file-loader',
                            options: {
                                name: 'files/[name].[ext]',
                            },
                        },
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/,
                        use: {
                            loader: 'file-loader',
                            options: {
                                name: 'fonts/[name].[ext]',
                            },
                        },
                    },
                    {
                        test: /\.xml$/,
                        use: ['raw-loader'],
                    },
                ],
            },
        ],
    },
    plugins: [new webpack_1.default.HotModuleReplacementPlugin(), new webpackbar_1.default()],
    resolve: {
        alias: {
            '@manuscripts/manuscript-transform': require.resolve('@manuscripts/manuscript-transform'),
            '@manuscripts/track-changes': require.resolve('@manuscripts/track-changes'),
            formik: require.resolve('formik'),
            'prosemirror-model': require.resolve('prosemirror-model'),
            react: require.resolve('react'),
            'react-dnd': require.resolve('react-dnd'),
            'react-dom': require.resolve('react-dom'),
            'react-hot-loader': require.resolve('react-hot-loader'),
            'react-router': require.resolve('react-router'),
            'styled-components': require.resolve('styled-components'),
        },
    },
    stats: 'errors-only',
    watchOptions: {
        aggregateTimeout: 1000,
        ignored: /node_modules\/(?!@manuscripts\/)/,
    },
});
exports.default = configuration;
//# sourceMappingURL=webpack.dev.js.map