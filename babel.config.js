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
    '@babel/syntax-dynamic-import',
  ],
  presets: [
    [
      '@babel/env',
      {
        corejs: 3,
        targets: 'last 2 years',
        useBuiltIns: 'usage',
      },
    ],
    '@babel/react',
    '@babel/typescript',
  ],
}
