// const path = require('path')

// TODO: remove this once the next version of storybook is released
// https://github.com/storybooks/storybook/issues/2836
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js')

module.exports = (baseConfig, env /*, defaultConfig*/) => {
  const defaultConfig = genDefaultConfig(baseConfig, env)

  defaultConfig.module.rules.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    // include: path.resolve(__dirname, '../src'),
    use: 'ts-loader',
  })

  defaultConfig.resolve.extensions.push('.ts', '.tsx')

  return defaultConfig
}
