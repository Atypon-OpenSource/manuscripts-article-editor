process.env.NODE_ENV = 'development'

require('dotenv').config()

const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    hot: true,
    open: true,
  },
  devtool: 'cheap-module-source-map',
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
                }
              },
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true,
                },
              },
            ],
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(png|jpg|gif|svg)$/,
            use: {
              loader: 'file-loader',
              options: {
                name: 'files/[name].[ext]'
              }
            },
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[ext]'
              }
            },
          },
          {
            test: /\.(xml)$/,
            use: ['raw-loader'],
          },
        ],
      },
    ],
  },
  performance: {
    hints: false,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ContextReplacementPlugin(
      /codemirror[\/\\]mode$/,
      /javascript|stex/ // TODO: all the modes needed for the listing format switcher
    ),
    new webpack.ContextReplacementPlugin(
      /react-intl[\/\\]locale-data$/,
      /en|ar|zh/ // TODO: all the locales needed for the locale switcher
    )
  ],
})
