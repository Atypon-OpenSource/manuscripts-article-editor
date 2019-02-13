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

import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { filterLibrary } from '../library'

describe('library filtering', () => {
  it('filterLibrary', () => {
    const map = new Map<string, BibliographyItem>()
    const x: BibliographyItem = {
      _id: 'MPBibliographyItem:x',
      keywordIDs: ['MPKeyword:derp'],
      containerID: 'MPLibrary:z',
      objectType: 'MPBibliographyItem',
      createdAt: 1,
      updatedAt: 1,
      type: 'article',
      title: 'xyz',
    }
    const y: BibliographyItem = {
      _id: 'MPBibliographyItem:y',
      containerID: 'MPLibrary:z',
      objectType: 'MPBibliographyItem',
      createdAt: 1,
      updatedAt: 1,
      type: 'article',
      title: 'yuv',
    }
    map.set('MPBibliographyItem:x', x)
    map.set('MPBibliographyItem:y', y)

    expect(filterLibrary(null, 'foo')).toMatchObject([])
    expect(filterLibrary(map, null).sort()).toMatchObject([x, y].sort())
    expect(filterLibrary(map, 'keyword:MPKeyword:derp')).toMatchObject([x])
    expect(filterLibrary(map, 'yuv')).toMatchObject([y])
  })
})
