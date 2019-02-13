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

import { initials } from '../name'

describe('name processing methods', () => {
  it('single initial exists when "given" is present with one given name', () => {
    expect(
      initials({
        _id: 'MPBibliographicName:X',
        objectType: 'MPBibliographicName',
        given: 'Derek Gilbert',
        family: 'Dilbert',
      })
    ).toMatch('D.')
  })

  it('initials exist when "given" is present with more than one given name', () => {
    expect(
      initials({
        _id: 'MPBibliographicName:X',
        objectType: 'MPBibliographicName',
        given: 'Derek Gilbert',
        family: 'Dilbert',
      })
    ).toMatch('D.G.')
  })

  it('initials empty when no given name is present', () => {
    expect(
      initials({
        _id: 'MPBibliographicName:X',
        objectType: 'MPBibliographicName',
        family: 'Dilbert',
      })
    ).toMatch('')
  })
})
