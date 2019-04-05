/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

process.env.NODE_ENV = 'development'

import dotenv from 'dotenv'
dotenv.config()

import webpack from 'webpack'
import merge from 'webpack-merge'
import common from './webpack.common'

const configuration: webpack.Configuration = merge(common, {
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    hot: true,
    open: true,
  },
  devtool: 'cheap-module-eval-source-map',
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
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    alias: {
      '@manuscripts/manuscript-transform': require.resolve(
        '@manuscripts/manuscript-transform'
      ),
      '@manuscripts/style-guide': require.resolve('@manuscripts/style-guide'),
      formik: require.resolve('formik'),
      react: require.resolve('react'),
      'react-dnd': require.resolve('react-dnd'),
      'react-dom': require.resolve('react-dom'),
      'react-hot-loader': require.resolve('react-hot-loader'),
      'styled-components': require.resolve('styled-components'),
    },
  },
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules\/(?!@manuscripts\/)/,
  },
})

export default configuration
