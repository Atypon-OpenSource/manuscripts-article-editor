process.env.NODE_ENV = 'development'

require('dotenv').config()

const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

let devServerOpts = {
  contentBase: './dist',
  historyApiFallback: true,
  host: '0.0.0.0',
  disableHostCheck: true,
  hot: true,
  open: true
  // proxy: {
  //   '/api': 'http://localhost:3000',
  // },
}

if (process.env.PUBLIC_HOSTNAME) {
  devServerOpts.public = process.env.PUBLIC_HOSTNAME
}

module.exports = merge(common, {
  devServer: devServerOpts,
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
            use: ['file-loader'],
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: ['file-loader'],
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
