import Raven from 'raven-js'
import config from '../config'

/* istanbul ignore next */
if (config.sentry.dsn) {
  Raven.config(config.sentry.dsn).install()
}
