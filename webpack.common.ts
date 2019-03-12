/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import { GenerateSW } from 'workbox-webpack-plugin'
import config from './src/config'

const configuration: webpack.Configuration = {
  entry: './src/index.tsx',
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
        'DISCOURSE_HOST',
        'GIT_COMMIT_HASH',
        'GIT_VERSION',
        'NATIVE',
        'NODE_ENV',
        'PRESSROOM_KEY',
        'PRESSROOM_URL',
        'PROJECTS_BUCKET',
        'SENTRY_PUBLIC_DSN',
        'SENTRY_RELEASE',
        'SERVICEWORKER_ENABLED',
        'SUPPORT_EMAIL',
        'SUPPORT_URL',
        'SYNC_GATEWAY_URL',
        'WAYF_KEY',
        'WAYF_URL',
      ]),
      new CopyWebpackPlugin(['public/landing.html', 'public/screenshot.png']),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        title: 'Manuscripts.io',
        url: config.url,
      }),
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
      new webpack.ContextReplacementPlugin(
        /react-intl[\/\\]locale-data$/,
        /en/ // TODO: all the locales needed for the locale switcher
      ),
    ]

    if (config.serviceworker) {
      plugins.push(
        // @ts-ignore (types version)
        new GenerateSW({
          cacheId: 'manuscripts-io',
          // @ts-ignore (types version)
          dontCacheBustURLsMatching: /\.\w{8}\./, // hash in filename
          // TODO: cache locales as they're loaded?
          importWorkboxFrom: 'local', // load workbox from local files
          navigateFallback: '/index.html',
          navigateFallbackBlacklist: [/^\/data\//], // shared data can be under /data
          // offlineGoogleAnalytics: true,
          runtimeCaching: [
            // cache shared data
            {
              urlPattern: new RegExp('^' + config.data.url),
              handler: 'CacheFirst',
            },
          ],
          // skipWaiting: true, // start running immediately
        })
      )
    }

    return plugins
  })(),
  resolve: {
    alias: {
      '@manuscripts/manuscript-transform': require.resolve(
        '@manuscripts/manuscript-transform'
      ),
      '@manuscripts/style-guide': require.resolve('@manuscripts/style-guide'),
      formik: require.resolve('formik'),
      react: require.resolve('react'),
      'react-dnd': require.resolve('react-dnd'),
      'react-dom': require.resolve('react-dom'),
      'react-hot-loader': require.resolve('react-hot-loader'),
      'styled-components': require.resolve('styled-components'),
    },
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
}

export default configuration
