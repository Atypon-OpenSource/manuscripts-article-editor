const HtmlWebpackPlugin = require('html-webpack-plugin')

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
  ],
  resolve: {
    alias: {
      react: require.resolve('react')
    },
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
}
