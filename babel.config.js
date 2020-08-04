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
    '@babel/proposal-nullish-coalescing-operator',
    '@babel/proposal-object-rest-spread',
    '@babel/proposal-optional-chaining',
    '@babel/proposal-unicode-property-regex',
    '@babel/syntax-dynamic-import',
  ],
  presets: [
    [
      '@babel/env',
      {
        corejs: 3,
        useBuiltIns: 'usage',
      },
    ],
    '@babel/react',
    '@babel/typescript',
  ],
}
