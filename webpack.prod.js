process.env.NODE_ENV = 'production'

const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  bail: true,
  // devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [
      {
        oneOf: [
          {
            exclude: /node_modules/,
            test: /\.tsx?$/,
            use: {
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig.build.json',
                transpileOnly: 'true'
              },
            },
          },
          {
            test: /\.css$/,
            // use: ExtractTextPlugin.extract({
            //   fallback: 'style-loader',
            //   use: 'css-loader',
            // }),
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(png|jpg|gif|svg|xml)$/,
            use: {
              loader: 'file-loader',
              options: {
                name: 'files/[name].[hash:8].[ext]'
              }
            },
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[hash:8].[ext]'
              }
            },
          },
        ],
      },
    ],
  },
  output: {
    chunkFilename: 'js/[name].[chunkhash:8].js',
    filename: 'js/[name].[chunkhash:8].js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    // new ExtractTextPlugin({
    //   allChunks: true,
    //   // filename: '[name].[contenthash].css',
    // }),
  ]
})
