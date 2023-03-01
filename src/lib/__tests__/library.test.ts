/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { BibliographyItem } from '@manuscripts/json-schema'

import { filterLibrary } from '../search-library'

describe('library filtering', () => {
  it('filterLibrary', async () => {
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
      manuscriptID: 'MPManuscript:1',
      sessionID: 'foo',
    }
    const y: BibliographyItem = {
      _id: 'MPBibliographyItem:y',
      containerID: 'MPLibrary:z',
      objectType: 'MPBibliographyItem',
      createdAt: 1,
      updatedAt: 1,
      type: 'article',
      title: 'yuv',
      manuscriptID: 'MPManuscript:1',
      sessionID: 'foo',
    }
    map.set('MPBibliographyItem:x', x)
    map.set('MPBibliographyItem:y', y)
    const keywords: Set<string> = new Set<string>()
    keywords.add('MPKeyword:derp')

    expect(await filterLibrary(undefined, 'foo')).toMatchObject([])
    expect((await filterLibrary(map, undefined)).sort()).toMatchObject(
      [x, y].sort()
    )
    expect(await filterLibrary(map, undefined, keywords)).toMatchObject([x])
    expect(await filterLibrary(map, 'yuv')).toMatchObject([y])
  })
})
