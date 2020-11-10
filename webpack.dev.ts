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

process.env.NODE_ENV = 'development'

import dotenv from 'dotenv'
dotenv.config()

import webpack from 'webpack'
import merge from 'webpack-merge'
import WebpackBar from 'webpackbar'

import common from './webpack.common'

const configuration: webpack.Configuration = merge(common, {
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    hot: true,
    open: true,
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
  plugins: [new webpack.HotModuleReplacementPlugin(), new WebpackBar()],
  resolve: {
    alias: {
      '@manuscripts/manuscript-transform': require.resolve(
        '@manuscripts/manuscript-transform'
      ),
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
})

export default configuration
