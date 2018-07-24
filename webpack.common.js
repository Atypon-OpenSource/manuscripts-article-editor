const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { GenerateSW } = require('workbox-webpack-plugin')

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
      'API_BASE_URL',
      'API_APPLICATION_ID',
      'BASE_URL',
      'DATA_URL',
      'GIT_COMMIT_HASH',
      'GIT_VERSION',
      'NODE_ENV',
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
    ),
    new GenerateSW({
      cacheId: 'manuscripts.io',
      // clientsClaim: true,
      dontCacheBustUrlsMatching: /\.[a-f0-9]{8}\./, // hash in filename
      exclude: [
        // /^\d+\./
        // TODO: cache locales + codemirror languages as they're loaded
        new RegExp(process.env.API_BASE_URL),
        new RegExp(process.env.SYNC_GATEWAY_URL),
        new RegExp('http://127.0.0.1'),
      ],
      importWorkboxFrom: 'local',
      navigateFallback: '/index.html',
      navigateFallbackBlacklist: [
        /^\/data\//
      ],
      // runtimeCaching: [
      //   {
      //     handler: 'cacheFirst',
      //     // handler: 'staleWhileRevalidate',
      //     urlPattern: new RegExp(process.env.CSL_URL),
      //   },
      // ],
      // skipWaiting: true,
    }),
  ],
  resolve: {
    alias: {
      react: require.resolve('react')
    },
    extensions: ['.tsx', '.ts', '.js', '.json'],
  }
}
