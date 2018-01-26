const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './src/index.tsx',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Manuscripts',
      template: 'public/index.html',
    }),
    new Dotenv({
      safe: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => /node_modules/.test(module.resource),
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true,
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: 'ts-loader',
          },
          {
            test: /\.css$/,
            use: isProduction
              ? ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: 'css-loader',
                })
              : ['style-loader', 'css-loader'],
          },
          {
            test: /\.(png|jpg|gif)$/,
            use: ['file-loader'],
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: ['file-loader'],
          },
        ],
      },
    ],
  },
}
