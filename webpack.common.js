const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  output: {
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
    // new ExtractTextPlugin({
    //   allChunks: true,
    //   // filename: '[name].[contenthash].css',
    // }),
  ],
  resolve: {
    alias: {
      react: require.resolve('react')
    },
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
}
