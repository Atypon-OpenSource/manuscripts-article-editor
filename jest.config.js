const coverageThreshold = (target, gradient = 1) => Math.min(
  ((new Date() - new Date('2018-07-01')) * gradient) / (1000 * 60 * 120 * 24),
  target
)

module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', 
    '!**/*.d.ts', 
    '!/**/__tests__',
    '!src/api/**',
    '!src/editor/**',
    '!src/resizer/**',
    '!src/lib/fonts.ts',
    '!src/lib/sentry.ts',
    '!src/lib/service-worker.ts',
  ],
  coverageThreshold: {
    global: {
      branches: coverageThreshold(60, 0.25),
      functions: coverageThreshold(60, 0.5),
      lines: coverageThreshold(60, 0.5),
    }
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
  testURL: "https://localhost",
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(lodash-es|@manuscripts)/)'],
}
