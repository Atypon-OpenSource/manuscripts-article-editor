import Raven from 'raven-js'
import config from '../config'

const { dsn, environment, release } = config.sentry

if (dsn) {
  Raven.config(dsn, { environment, release }).install()
}
