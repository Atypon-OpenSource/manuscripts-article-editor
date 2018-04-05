module.exports = (storybookBaseConfig, configType) => {
  /* tslint:disable-next-line:no-console */
  console.log(configType)

  // storybookBaseConfig.mode = configType.toLowerCase()

  storybookBaseConfig.module.rules.push({
    exclude: /node_modules/,
    test: /\.tsx?$/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
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

  storybookBaseConfig.resolve.extensions.push('.ts', '.tsx')

  return storybookBaseConfig
}
