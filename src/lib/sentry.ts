import Raven from 'raven-js'
import config from '../config'

if (config.sentry.dsn) {
  Raven.config(config.sentry.dsn).install()
}
