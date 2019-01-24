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
  performance: {
    hints: false,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules\/(?!@manuscripts\/)/,
  },
})

export default configuration
