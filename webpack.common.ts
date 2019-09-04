/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import { GenerateSW } from 'workbox-webpack-plugin'
import WorkerPlugin from 'worker-plugin'
import config from './src/config'

const configuration: webpack.Configuration = {
  entry: './src/index.tsx',
  output: {
    publicPath: '/',
  },
  plugins: (() => {
    const plugins = [
      new CleanWebpackPlugin(),
      new webpack.EnvironmentPlugin([
        'API_APPLICATION_ID',
        'API_BASE_URL',
        'BASE_URL',
        'BEACON_HTTP_URL',
        'BEACON_WS_URL',
        'CI_ENVIRONMENT_NAME',
        'CRISP_WEBSITE_ID',
        'DATA_URL',
        'DERIVED_DATA_BUCKET',
        'DISCOURSE_HOST',
        'ENABLE_CONNECT_LOGIN_OPTION',
        'GIT_COMMIT_HASH',
        'GIT_VERSION',
        'GOOGLE_ANALYTICS_ID',
        'IAM_HOST',
        'JUPYTER_TOKEN',
        'JUPYTER_URL',
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
      ]),
      new CopyWebpackPlugin([
        'public/landing.html',
        'public/screenshot.png',
        'public/modernizr.js',
      ]),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        title: 'Manuscripts.io',
        url: config.url,
        featureTest: !config.native,
        crisp: config.crisp.id,
        analytics: config.analytics.id,
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
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
      new WorkerPlugin(),
    ]

    if (config.serviceworker) {
      plugins.push(
        new GenerateSW({
          cacheId: 'manuscripts-io',
          // dontCacheBustURLsMatching: /\.\w{8}\./, // hash in filename
          // TODO: cache locales as they're loaded?
          importWorkboxFrom: 'local', // load workbox from local files
          navigateFallback: '/index.html',
          navigateFallbackBlacklist: [/^\/data\//], // shared data can be under /data
          offlineGoogleAnalytics: true,
          runtimeCaching: [
            // cache shared data
            {
              urlPattern: new RegExp('^' + config.data.url),
              handler: 'StaleWhileRevalidate',
            },
          ],
        })
      )
    }

    return plugins
  })(),
  resolve: {
    extensions: ['.tsx', '.ts', '.mjs', '.js', '.json'],
  },
}

export default configuration
