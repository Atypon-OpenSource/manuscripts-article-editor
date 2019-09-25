const config = require('./jest.config')

module.exports = {
  ...config,
  setupFiles: [
    ...config.setupFiles,
    'dotenv/config',
  ],
  testRegex: '/__tests__/.*\\.integration-test\\.tsx?$',
}

