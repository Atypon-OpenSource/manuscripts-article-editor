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
module.exports = {
  compact: false,
  env: {
    development: {
      plugins: ['react-hot-loader/babel', 'react-intl'],
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
        corejs: {
          version: 3,
          // proposals: true
        },
        useBuiltIns: 'usage',
        // forceAllTransforms: true,
      },
    ],
    '@babel/react',
    '@babel/typescript',
  ],
}
