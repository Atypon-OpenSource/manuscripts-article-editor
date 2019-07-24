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

import 'autotrack/lib/plugins/clean-url-tracker'
import 'autotrack/lib/plugins/event-tracker'
import 'autotrack/lib/plugins/impression-tracker'
import 'autotrack/lib/plugins/media-query-tracker'
import 'autotrack/lib/plugins/outbound-link-tracker'
import 'autotrack/lib/plugins/page-visibility-tracker'
import 'autotrack/lib/plugins/url-change-tracker'

export interface GoogleAnalyticsConfig {
  id: string
}

export const init = ({ id }: GoogleAnalyticsConfig) => {
  ga =
    ga ||
    // tslint:disable-next-line:only-arrow-functions
    function() {
      ga.q = ga.q || []
      ga.q.push(arguments)
    }

  ga.l = +new Date()

  ga('create', id, 'auto')

  ga('require', 'cleanUrlTracker')
  ga('require', 'eventTracker')
  ga('require', 'impressionTracker')
  ga('require', 'mediaQueryTracker')
  ga('require', 'outboundLinkTracker')
  ga('require', 'pageVisibilityTracker')
  ga('require', 'urlChangeTracker')

  ga('send', 'pageview')
}
