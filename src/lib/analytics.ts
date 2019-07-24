/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import config from '../config'
import { GoogleAnalyticsConfig } from './google-analytics'
import { SentryConfig } from './sentry'

if (config.analytics.id) {
  import('./google-analytics')
    .then(({ init }) => {
      init(config.analytics as GoogleAnalyticsConfig)
    })
    .catch(error => {
      // tslint:disable-next-line:no-console
      console.error(error)
    })
}

if (config.sentry.dsn) {
  import('./sentry')
    .then(({ init }) => {
      init(config.sentry as SentryConfig)
    })
    .catch(error => {
      // tslint:disable-next-line:no-console
      console.error(error)
    })
}
