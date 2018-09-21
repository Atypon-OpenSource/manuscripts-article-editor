import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import { GenerateSW } from 'workbox-webpack-plugin'
import config from './src/config'

const configuration: webpack.Configuration = {
  entry: './src/index.tsx',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  output: {
    publicPath: '/',
  },
  plugins: (() => {
    const plugins = [
      new webpack.EnvironmentPlugin([
        'API_APPLICATION_ID',
        'API_BASE_URL',
        'BASE_URL',
        'CI_ENVIRONMENT_NAME',
        'DATA_URL',
        'GIT_COMMIT_HASH',
        'GIT_VERSION',
        'NODE_ENV',
        'PRESSROOM_KEY',
        'PRESSROOM_URL',
        'PROJECTS_BUCKET',
        'SENTRY_PUBLIC_DSN',
        'SENTRY_RELEASE',
        'SERVICEWORKER_ENABLED',
        'SYNC_GATEWAY_URL',
        'WAYF_KEY',
        'WAYF_URL',
      ]),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        title: 'Manuscripts',
      }),
      // tslint:disable-next-line:deprecation (typing bug)
      new webpack.NormalModuleReplacementPlugin(
        /AsyncLoad\.js/,
        // tslint:disable-next-line:no-any
        (resource: any) => {
          resource.request = resource.request.replace(
            /AsyncLoad/,
            'AsyncLoad-disabled'
          )
        }
      ),
    ]

    if (config.serviceworker) {
      plugins.push(
        new GenerateSW({
          cacheId: 'manuscripts.io',
          // clientsClaim: true,
          dontCacheBustUrlsMatching: /\.[a-f0-9]{8}\./, // hash in filename
          exclude: [
            // /^\d+\./
            // TODO: cache locales + codemirror languages as they're loaded
            config.api.url && new RegExp(config.api.url),
            config.gateway.url && new RegExp(config.gateway.url),
            new RegExp('http://127.0.0.1'),
          ],
          importWorkboxFrom: 'local',
          navigateFallback: '/index.html',
          navigateFallbackBlacklist: [/^\/data\//],
          // runtimeCaching: [
          //   {
          //     handler: 'cacheFirst',
          //     // handler: 'staleWhileRevalidate',
          //     urlPattern: new RegExp(appConfig.csl.url),
          //   },
          // ],
          // skipWaiting: true,
        })
      )
    }

    return plugins
  })(),
  resolve: {
    alias: {
      react: require.resolve('react'),
    },
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
}

export default configuration
