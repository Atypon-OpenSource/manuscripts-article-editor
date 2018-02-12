// const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

// TODO: remove this once the next version of storybook is released
// https://github.com/storybooks/storybook/issues/2836
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js')

module.exports = (baseConfig, env /*, defaultConfig*/) => {
  const defaultConfig = genDefaultConfig(baseConfig, env)

  defaultConfig.module.rules.push({
    exclude: /node_modules/,
    test: /\.tsx?$/,
    use: 'ts-loader',
  })

  /* tslint:disable-next-line:no-console */
  console.log(env)

  if (env === 'PRODUCTION') {
    defaultConfig.plugins.push(
      new UglifyJSPlugin({
        sourceMap: false,
      })
    )
  }

  // defaultConfig.plugins.push(new webpack.DefinePlugin({
  //   'process.env.NODE_ENV': JSON.stringify('production'),
  // }))

  defaultConfig.resolve.extensions.push('.ts', '.tsx')

  return defaultConfig
}
