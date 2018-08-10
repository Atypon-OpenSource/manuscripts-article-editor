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
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-unicode-property-regex',
    'syntax-dynamic-import',
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
}
