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

import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import {
  estimateID,
  filterLibrary,
  issuedYear,
  shortAuthorsString,
} from '../library'

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
    const keywords: Set<string> = new Set<string>()
    keywords.add('MPKeyword:derp')

    expect(filterLibrary(undefined, 'foo')).toMatchObject([])
    expect(filterLibrary(map, undefined).sort()).toMatchObject([x, y].sort())
    expect(filterLibrary(map, undefined, keywords)).toMatchObject([x])
    expect(filterLibrary(map, 'yuv')).toMatchObject([y])
  })
})

describe('issued year', () => {
  it('issuedYear', () => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const item = {
      issued: {
        ['date-parts']: [['2019']],
      },
    } as BibliographyItem

    expect(issuedYear(item)).toBe('(2019) ')
    // tslint:disable-next-line:no-object-literal-type-assertion
    expect(issuedYear({} as BibliographyItem)).toBeNull()
  })
})

describe('estimate ID', () => {
  it('estimateID - DOI exists', () => {
    const item = {
      DOI: 'valid-doi',
    }
    expect(estimateID(item)).toBe('VALID-DOI')
  })

  it('estimateID - DOI does not exist', () => {
    const item = {
      title: 'title',
      issued: {
        ['date-parts']: [['2019']],
      },
    }

    expect(estimateID(item as BibliographyItem)).toBe(
      JSON.stringify({
        title: 'title',
        author: null,
        year: '(2019) ',
      })
    )

    expect(
      estimateID(({ author: [], ...item } as unknown) as BibliographyItem)
    ).toBe(
      JSON.stringify({
        title: 'title',
        author: null,
        year: '(2019) ',
      })
    )

    const author = [
      {
        family: 'family',
        literal: 'L',
        given: 'given',
      },
      // tslint:disable-next-line:no-any
    ] as any

    // tslint:disable-next-line:no-object-literal-type-assertion
    expect(estimateID({ ...item, author } as BibliographyItem)).toBe(
      JSON.stringify({
        title: 'title',
        author: 'family',
        year: '(2019) ',
      })
    )
  })
})

describe('short authors string', () => {
  it('shortAuthorsString - 1 author', () => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const item = {
      author: [
        {
          family: 'family',
          literal: 'L',
          given: 'given',
        },
      ],
    } as BibliographyItem

    expect(shortAuthorsString(item)).toBe('family')
  })

  it('shortAuthorsString - 2 author', () => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const item = {
      author: [{ family: 'family' }, { literal: 'L' }],
    } as BibliographyItem

    expect(shortAuthorsString(item)).toBe('family & L')
  })

  it('shortAuthorsString - 4 author', () => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const item = {
      author: [
        { family: 'family' },
        { literal: 'L' },
        { given: 'given' },
        { family: 'family2' },
      ],
    } as BibliographyItem

    expect(shortAuthorsString(item)).toBe('family, L & family2')
  })
})
