const coverageThreshold = Math.max(
  0.25,
  Math.min(
    Math.floor(
      Math.max(0, (new Date() - new Date('2018-07-01')) / (1000 * 60 * 60 * 24))
    ),
    60
  )
)

module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: coverageThreshold,
      functions: coverageThreshold,
      lines: coverageThreshold,
    }
  },
  globals: {
    'ts-jest': {
      useBabelrc: true,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^.+\\.(jpg|png|eot|otf|svg|ttf|woff|woff2)$':
      '<rootDir>/src/__mocks__/fileMock.ts',
    '^.+\\.css$': '<rootDir>/src/__mocks__/styleMock.ts',
    '^.+\\.xml$': '<rootDir>/src/__mocks__/rawMock.ts',
  },
  setupFiles: ['./src/setupTests.ts'],
  setupTestFrameworkScriptFile: './node_modules/jest-enzyme/lib/index.js',
  testPathIgnorePatterns: ['/node_modules/'],
  testRegex: '__tests__.*\\.test\\.tsx?$',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es/)'],
}
