process.env.NODE_ENV = 'production'

import CleanWebpackPlugin from 'clean-webpack-plugin'
import webpack from 'webpack'
import merge from 'webpack-merge'
// import ExtractTextPlugin from 'extract-text-webpack-plugin'
import common, { svgrLoader } from './webpack.common'

const configuration: webpack.Configuration = merge(common, {
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
            // use: ExtractTextPlugin.extract({
            //   fallback: 'style-loader',
            //   use: 'css-loader',
            // }),
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(png|jpg|gif|xml)$/,
            use: {
              loader: 'file-loader',
              options: {
                name: 'files/[name].[hash:8].[ext]',
              },
            },
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[hash:8].[ext]',
              },
            },
          },
          {
            test: /\.svg$/,
            use: [
              {
                loader: 'babel-loader',
              },
              svgrLoader,
            ],
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
  ],
})

export default configuration
