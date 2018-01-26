process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
    open: true,
    // proxy: {
    //   '/api': 'http://localhost:3000',
    // },
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  performance: {
    hints: false,
  },
})
