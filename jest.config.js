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
    '!src/lib/developer.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 35,
      lines: 35,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^.+\\.(jpg|png|eot|otf|svg|ttf|woff|woff2)$':
      '<rootDir>/src/__mocks__/fileMock.ts',
    '^.+\\.css$': '<rootDir>/src/__mocks__/styleMock.ts',
    '^.+\\.xml$': '<rootDir>/src/__mocks__/rawMock.ts',
    // https://react-dnd.github.io/react-dnd/docs/testing#setup
    "^dnd-core$": "dnd-core/dist/cjs",
    "^react-dnd$": "react-dnd/dist/cjs",
    // map react-dnd-html5-backend to react-dnd-test-backend
    "^react-dnd-html5-backend$": "react-dnd-test-backend/dist/cjs",
    "^react-dnd-test-utils$": "react-dnd-test-utils/dist/cjs"
  },
  setupFiles: ['./src/setupTests.ts', 'jsdom-worker'],
  setupFilesAfterEnv: ['<rootDir>/node_modules/jest-enzyme/lib/index.js'],
  testEnvironment: 'jest-environment-jsdom-sixteen',
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '/__tests__/.*\\.test\\.tsx?$',
  testURL: 'https://localhost',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(lodash-es|@manuscripts)/)',
  ],
}
