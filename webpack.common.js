const path = require('path')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      title: 'Manuscripts',
    }),
    new Dotenv({
      safe: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      minChunks: module => /node_modules/.test(module.resource),
      name: 'vendor',
    }),
    new ExtractTextPlugin({
      allChunks: true,
      filename: '[name].[contenthash].css',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
}
