const coverageThreshold = (target, gradient = 1) => Math.min(
  ((new Date() - new Date('2018-07-01')) * gradient) / (1000 * 60 * 60 * 24),
  target
)

module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', 
    '!**/*.d.ts', 
    '!/**/__tests__',
    '!src/editor/config/rules.ts', 
    '!src/editor/config/commands.ts',
    '!src/editor/lib/popper.ts'
  ],
  coverageThreshold: {
    global: {
      branches: coverageThreshold(60, 0.5),
      functions: coverageThreshold(60),
      lines: coverageThreshold(60),
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
