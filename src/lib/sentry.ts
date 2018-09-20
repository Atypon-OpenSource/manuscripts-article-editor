import Raven from 'raven-js'
import config from '../config'

const { dsn, environment, release } = config.sentry

/* istanbul ignore next */
if (dsn) {
  Raven.config(dsn, { environment, release }).install()
}
