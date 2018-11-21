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
