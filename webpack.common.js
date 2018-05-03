const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

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
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      title: 'Manuscripts',
    }),
    new webpack.NormalModuleReplacementPlugin(
      /AsyncLoad\.js/,
      resource => {
        resource.request = resource.request.replace(/AsyncLoad/, 'AsyncLoad-disabled')
      }
    )
  ],
  resolve: {
    alias: {
      react: require.resolve('react')
    },
    extensions: ['.tsx', '.ts', '.js', '.json'],
  }
}
