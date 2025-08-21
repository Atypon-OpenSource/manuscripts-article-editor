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
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!/**/__tests__',
    '!/**/__mocks__',
    '!/**/__fixtures__',
    '!src/data/*.tsx',
    '!src/lib/fonts.ts',
    '!src/lib/service-worker.ts',
  ],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  coverageReporters: ['text-summary'],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 25,
      lines: 30,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^.+\\.(jpg|png|eot|otf|svg|ttf|woff|woff2)$':
      '<rootDir>/src/__mocks__/fileMock.ts',
    '^.+\\.css$': '<rootDir>/src/__mocks__/styleMock.ts',
    '^.+\\.xml$': '<rootDir>/src/__mocks__/rawMock.ts',
    // https://react-dnd.github.io/react-dnd/docs/testing#setup
    '^dnd-core$': 'dnd-core/dist/cjs',
    '^react-dnd$': 'react-dnd/dist/cjs',
    // map react-dnd-html5-backend to react-dnd-test-backend
    '^react-dnd-html5-backend$': 'react-dnd-test-backend/dist/cjs',
    '^react-dnd-test-utils$': 'react-dnd-test-utils/dist/cjs',
  },
  setupFiles: ['./src/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '/__tests__/.*\\.test\\.tsx?$',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(lodash-es|@manuscripts|pdfjs-dist)/)',
  ],
}
