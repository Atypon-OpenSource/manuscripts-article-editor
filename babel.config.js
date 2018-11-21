module.exports = {
  env: {
    development: {
      plugins: [
        'react-hot-loader/babel',
        [
          'react-intl',
          {
            messagesDir: './build/messages/',
          },
        ],
      ],
    },
    test: {
      plugins: [
        'dynamic-import-node',
        'require-context-hook',
        'transform-es2015-modules-commonjs',
      ],
    },
  },
  plugins: [
    'styled-components',
    '@babel/proposal-class-properties',
    '@babel/proposal-unicode-property-regex',
    '@babel/proposal-object-rest-spread',
    'syntax-dynamic-import',
  ],
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage'
    }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
}
