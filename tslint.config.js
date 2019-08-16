const {
  licenseMatcher,
  licenseHeader,
} = require('@manuscripts/tslint-config/config/cpal-file-header')

const name = 'manuscripts-frontend'

module.exports = {
  extends: '@manuscripts/tslint-config',
  rules: {
    'file-header': [true, licenseMatcher(name), licenseHeader(name)]
  },
}
