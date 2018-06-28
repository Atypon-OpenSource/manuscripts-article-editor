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
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'API_BASE_URL',
      'API_APPLICATION_ID',
      'CSL_DATA_URL',
      'SENTRY_PUBLIC_DSN',
      'SYNC_GATEWAY_URL',
      'WAYF_KEY',
      'WAYF_URL',
    ]),
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
