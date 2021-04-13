/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */
const webpack = require('webpack')
const WorkerPlugin = require('worker-plugin')

module.exports = ({ config, mode }) => {
  console.log(mode)

  // storybookBaseConfig.mode = configType.toLowerCase()

  if (mode === 'PRODUCTION') {
    config.devtool = false
  }

  // remove the image rule
  // https://github.com/storybookjs/storybook/issues/5941
  config.module.rules = config.module.rules.filter(
    (rule) => !rule.test.toString().includes('png')
  )

  config.module.rules.push({
    test: /\.(png|jpg|gif)$/,
    use: ['file-loader'],
  })

  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: ['file-loader'],
  })

  config.module.rules.push({
    test: /\.mjs$/,
    type: 'javascript/auto',
  })

  config.module.rules.push({
    test: /\.xml$/,
    use: ['raw-loader'],
  })

  config.plugins.push(
    new webpack.ContextReplacementPlugin(
      /react-intl[/\\]locale-data$/,
      /en|ar|zh/ // TODO: all the locales needed for the locale switcher
    )
  )

  config.plugins.push(
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/)
  )

  config.plugins.push(new WorkerPlugin())

  config.resolve.extensions.push('.ts', '.tsx')

  config.resolve.alias = {
    // This seems to conflict with the jsx-runtime, maybe an issue with storybook itself
    // react: require.resolve('react'),
    'react/jsx-runtime': require.resolve('react/jsx-runtime'),
    'react-dom': require.resolve('react-dom'),
    'react-hot-loader': require.resolve('react-hot-loader'),
    'styled-components': require.resolve('styled-components'),
  }

  config.watchOptions = {
    ignored: /node_modules\/(?!@manuscripts\/)/,
  }

  config.node = {
    fs: 'empty',
    path: 'empty',
  }
  return config
}
