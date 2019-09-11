const webpack = require('webpack')
const WorkerPlugin = require('worker-plugin')

module.exports = ({ config, mode }) => {
  console.log(mode) // tslint:disable-line:no-console

  // storybookBaseConfig.mode = configType.toLowerCase()

  if (mode === 'PRODUCTION') {
    config.devtool = false
  }

  config.module.rules[0].use[0].options.presets = [
    require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-typescript'),
  ]

  config.module.rules[0].use[0].options.plugins = [
    require.resolve('@babel/plugin-proposal-class-properties'),
  ]

  config.module.rules.push({
    exclude: /node_modules/,
    test: /\.tsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    },
  })

  // remove the image rule
  // https://github.com/storybookjs/storybook/issues/5941
  config.module.rules = config.module.rules.filter(
    rule => !rule.test.toString().includes('png')
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
    test: /\.xml$/,
    use: ['raw-loader'],
  })

  config.plugins.push(
    new webpack.ContextReplacementPlugin(
      /react-intl[\/\\]locale-data$/,
      /en|ar|zh/ // TODO: all the locales needed for the locale switcher
    )
  )

  config.plugins.push(
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
  )


    config.plugins.push(new WorkerPlugin())

  config.resolve.extensions.push('.ts', '.tsx')

  config.resolve.alias = {
    react: require.resolve('react'),
    'react-dom': require.resolve('react-dom'),
    'react-hot-loader': require.resolve('react-hot-loader'),
    'styled-components': require.resolve('styled-components'),
  }

  config.watchOptions = {
    ignored: /node_modules\/(?!@manuscripts\/)/,
  }

  return config
}
