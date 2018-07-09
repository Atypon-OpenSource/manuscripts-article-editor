import {
  AFFILIATION,
  CONTRIBUTOR,
  MANUSCRIPT,
} from '../../../../transformer/object-types'
import {
  Affiliation,
  ComponentMap,
  ComponentWithAttachment,
  Contributor,
  Manuscript,
} from '../../../../types/components'
import {
  buildAffiliationsMap,
  buildAuthorAffiliations,
  buildAuthorsAndAffiliations,
  buildSortedAuthors,
  isFirstAuthor,
} from '../authors'

const componentMap = (components: ComponentWithAttachment[]): ComponentMap => {
  const map = new Map<string, ComponentWithAttachment>()
  components.forEach(x => map.set(x.id, x))
  return map
}

const affiliation: Affiliation = {
  id: 'MPAffiliation:X',
  objectType: AFFILIATION,
  name: 'University of Toronto',
  manuscriptID: 'MPManuscript:X',
  containerID: 'MPProject:1',
}

const affiliations = [affiliation]

const contribs: Contributor[] = [
  {
    id: 'MPContributor:x',
    objectType: CONTRIBUTOR,
    priority: 1,
    bibliographicName: {
      _id: 'MPBibliographicName:x-name',
      objectType: 'MPBibliographicName',
    },
    manuscriptID: 'MPManuscript:A',
    containerID: 'MPProject:1',
    role: 'author',
    affiliations: affiliations.map(a => a.id),
  },
  {
    id: 'MPContributor:y',
    objectType: CONTRIBUTOR,
    priority: 0,
    bibliographicName: {
      _id: 'MPBibliographicName:y-name',
      objectType: 'MPBibliographicName',
    },
    manuscriptID: 'manuscript-A',
    containerID: 'MPProject:1',
    isJointContributor: true,
    role: 'author',
  },
  {
    id: 'MPContributor:z',
    objectType: CONTRIBUTOR,
    priority: 2,
    bibliographicName: {
      _id: 'MPBibliographicName:z-name',
      objectType: 'MPBibliographicName',
    },
    manuscriptID: 'manuscript-A',
    containerID: 'MPProject:1',
    role: 'author',
  },
]

const manuscripts: Manuscript[] = [
  {
    id: 'MPManuscript:x',
    objectType: MANUSCRIPT,
    containerID: 'MPProject:1',
    title: 'Manuscript X',
    figureElementNumberingScheme: 'x',
    figureNumberingScheme: 'y',
  },
]

const objs: ComponentWithAttachment[] = manuscripts
  // tslint:disable-next-line:no-any
  .concat(contribs as any)
  // tslint:disable-next-line:no-any
  .concat(affiliations as any)

describe('author and affiliation helpers', () => {
  it('buildSortedAuthors', () => {
    // FIXME: buildSortedAuthors should not ignore silently encountering contributors with no "role" or "priority" fields present.
    // tslint:disable-line:no-any
    expect(buildSortedAuthors(componentMap(objs)).map(x => x.id)).toEqual([
      'MPContributor:y',
      'MPContributor:x',
      'MPContributor:z',
    ])
  })

  it('isFirstAuthor', () => {
    // FIXME: isFirstAuthor should not ignore silently encountering unexpected priority values (they should be the very least monotonously growing)
    const sortedAuthors = buildSortedAuthors(componentMap(contribs))
    expect(isFirstAuthor(sortedAuthors, 0)).toBeTruthy()
    expect(isFirstAuthor(sortedAuthors, 1)).toBeTruthy()
    expect(isFirstAuthor(sortedAuthors, 2)).toBeFalsy()
  })

  it('buildAffiliationsMap', () => {
    const affMap = buildAffiliationsMap(
      affiliations.map(x => x.id),
      componentMap(objs)
    )
    expect(Array.from(affMap)).toEqual([['MPAffiliation:X', affiliations[0]]])
  })

  it('buildAuthorAffiliations', () => {
    const affMap = buildAffiliationsMap(
      affiliations.map(x => x.id),
      componentMap(objs)
    )
    const authorAffMap = buildAuthorAffiliations(
      contribs,
      affMap,
      Array.from(affMap.keys())
    )

    expect(authorAffMap).toEqual(
      new Map(
        Object.entries({
          'MPContributor:x': [{ data: affiliation, ordinal: 1 }],
          'MPContributor:y': [],
          'MPContributor:z': [],
        })
      )
    )
  })

  it('buildAuthorsAndAffiliations', () => {
    const comps = componentMap(objs)
    const map = buildAuthorsAndAffiliations(comps)
    expect(map).toEqual({
      affiliations: new Map(Object.entries({ 'MPAffiliation:X': affiliation })),
      authorAffiliations: new Map(
        Object.entries({
          'MPContributor:y': [],
          'MPContributor:x': [{ data: affiliation, ordinal: 1 }],
          'MPContributor:z': [],
        })
      ),
      authors: buildSortedAuthors(comps),
    })
  })
})
