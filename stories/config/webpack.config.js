const webpack = require('webpack')

module.exports = (storybookBaseConfig, configType) => {
  console.log(configType) // tslint:disable-line:no-console

  // storybookBaseConfig.mode = configType.toLowerCase()

  if (configType === 'PRODUCTION') {
    storybookBaseConfig.devtool = false
  }

  storybookBaseConfig.module.rules[0].use[0].options.presets = [
    require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-typescript'),
  ]

  storybookBaseConfig.module.rules[0].use[0].options.plugins = [
    require.resolve('@babel/plugin-proposal-class-properties'),
  ]

  storybookBaseConfig.module.rules.push({
    exclude: /node_modules/,
    test: /\.tsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    },
  })

  storybookBaseConfig.module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  })

  storybookBaseConfig.module.rules.push({
    test: /\.(png|jpg|gif|svg)$/,
    use: ['file-loader'],
  })

  storybookBaseConfig.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: ['file-loader'],
  })

  storybookBaseConfig.module.rules.push({
    test: /\.xml$/,
    use: ['raw-loader'],
  })

  storybookBaseConfig.plugins.push(
    new webpack.NormalModuleReplacementPlugin(/AsyncLoad\.js/, resource => {
      resource.request = resource.request.replace(
        /AsyncLoad/,
        'AsyncLoad-disabled'
      )
    })
  )

  storybookBaseConfig.plugins.push(
    new webpack.ContextReplacementPlugin(
      /codemirror[\/\\]mode$/,
      /javascript|stex/ // TODO: all the modes needed for the listing format switcher
    )
  )

  storybookBaseConfig.plugins.push(
    new webpack.ContextReplacementPlugin(
      /react-intl[\/\\]locale-data$/,
      /en|ar|zh/ // TODO: all the locales needed for the locale switcher
    )
  )

  storybookBaseConfig.resolve.extensions.push('.ts', '.tsx')

  return storybookBaseConfig
}
