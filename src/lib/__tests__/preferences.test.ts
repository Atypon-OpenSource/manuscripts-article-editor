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

import Prefs, { defaults, Preferences } from '../preferences'

describe('preferences', () => {
  it('have defaults', () => {
    expect(Prefs.get()).toEqual(defaults)
  })

  it('can be set and removed', () => {
    const prefs: Preferences = { locale: 'en-US' }
    expect(Prefs.set(prefs)).toEqual(prefs)
    expect(Prefs.get()).toEqual(prefs)

    Prefs.remove()
    expect(Prefs.get()).toEqual(defaults) // check that we're back to defaults
  })
})
