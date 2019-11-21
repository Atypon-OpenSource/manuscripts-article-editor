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

import { DEFAULT_BUNDLE } from '@manuscripts/manuscript-transform'
import {
  Affiliation,
  Contributor,
  Manuscript,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import {
  buildAffiliationIDs,
  buildAffiliationsMap,
  buildAuthorAffiliations,
  buildAuthorPriority,
  buildAuthorsAndAffiliations,
  buildSortedAuthors,
  isJointFirstAuthor,
  reorderAuthors,
} from '../authors'

const affiliation: Affiliation = {
  _id: 'MPAffiliation:X',
  objectType: ObjectTypes.Affiliation,
  institution: 'University of Toronto',
  manuscriptID: 'MPManuscript:X',
  containerID: 'MPProject:1',
  priority: 0,
  sessionID: 'test',
  createdAt: 0,
  updatedAt: 0,
}

const affiliations = [affiliation]

const contribs: Contributor[] = [
  {
    _id: 'MPContributor:x',
    objectType: ObjectTypes.Contributor,
    priority: 1,
    bibliographicName: {
      _id: 'MPBibliographicName:x-name',
      objectType: 'MPBibliographicName',
    },
    manuscriptID: 'MPManuscript:A',
    containerID: 'MPProject:1',
    role: 'author',
    affiliations: affiliations.map(a => a._id),
    sessionID: 'test',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPContributor:y',
    objectType: ObjectTypes.Contributor,
    priority: 0,
    bibliographicName: {
      _id: 'MPBibliographicName:y-name',
      objectType: 'MPBibliographicName',
    },
    manuscriptID: 'manuscript-A',
    containerID: 'MPProject:1',
    isJointContributor: true,
    role: 'author',
    sessionID: 'test',
    createdAt: 0,
    updatedAt: 0,
  },
  {
    _id: 'MPContributor:z',
    objectType: ObjectTypes.Contributor,
    priority: 2,
    bibliographicName: {
      _id: 'MPBibliographicName:z-name',
      objectType: 'MPBibliographicName',
    },
    manuscriptID: 'manuscript-A',
    containerID: 'MPProject:1',
    role: 'author',
    sessionID: 'test',
    createdAt: 0,
    updatedAt: 0,
  },
]

const manuscripts: Manuscript[] = [
  {
    _id: 'MPManuscript:x',
    objectType: ObjectTypes.Manuscript,
    containerID: 'MPProject:1',
    title: 'Manuscript X',
    bundle: DEFAULT_BUNDLE,
    sessionID: 'test',
    createdAt: 0,
    updatedAt: 0,
  },
]

const objs: Model[] = manuscripts
  // tslint:disable-next-line:no-any
  .concat(contribs as any)
  // tslint:disable-next-line:no-any
  .concat(affiliations as any)

describe('author and affiliation helpers', () => {
  it('buildSortedAuthors', () => {
    // FIXME: buildSortedAuthors should not ignore silently encountering contributors with no "role" or "priority" fields present.
    // tslint:disable-line:no-any
    expect(buildSortedAuthors(contribs).map(item => item._id)).toEqual([
      'MPContributor:y',
      'MPContributor:x',
      'MPContributor:z',
    ])
  })

  it('is joint first author', () => {
    // FIXME: isFirstAuthor should not ignore silently encountering unexpected priority values (they should be the very least monotonously growing)

    const authors: Contributor[] = [
      {
        _id: 'MPContributor:author-1',
        objectType: ObjectTypes.Contributor,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-1',
          objectType: 'MPBibliographicName',
        },
        isJointContributor: true,
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
      },
      {
        _id: 'MPContributor:author-2',
        objectType: ObjectTypes.Contributor,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-2',
          objectType: 'MPBibliographicName',
        },
        isJointContributor: false,
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
      },
      {
        _id: 'MPContributor:author-3',
        objectType: ObjectTypes.Contributor,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-3',
          objectType: 'MPBibliographicName',
        },
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
      },
    ]

    expect(isJointFirstAuthor(authors, 0)).toBe(true)
    expect(isJointFirstAuthor(authors, 1)).toBe(true)
    expect(isJointFirstAuthor(authors, 2)).toBe(false)
  })

  it('is not joint first author', () => {
    const authors: Contributor[] = [
      {
        _id: 'MPContributor:author-1',
        objectType: ObjectTypes.Contributor,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-1',
          objectType: 'MPBibliographicName',
        },
        isJointContributor: false,
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
      },
      {
        _id: 'MPContributor:author-2',
        objectType: ObjectTypes.Contributor,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-2',
          objectType: 'MPBibliographicName',
        },
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
      },
      {
        _id: 'MPContributor:author-3',
        objectType: ObjectTypes.Contributor,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-3',
          objectType: 'MPBibliographicName',
        },
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
      },
    ]

    expect(isJointFirstAuthor(authors, 0)).toBe(false)
    expect(isJointFirstAuthor(authors, 1)).toBe(false)
    expect(isJointFirstAuthor(authors, 2)).toBe(false)
  })

  it('buildAffiliationsMap', () => {
    const affMap = buildAffiliationsMap(
      affiliations.map(x => x._id),
      affiliations
    )
    expect(Array.from(affMap)).toEqual([['MPAffiliation:X', affiliations[0]]])
  })

  it('buildAuthorAffiliations', () => {
    const affMap = buildAffiliationsMap(
      affiliations.map(x => x._id),
      affiliations
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
    const authors = objs.filter(
      obj => obj.objectType === ObjectTypes.Contributor
    ) as Contributor[]

    /* tslint:disable-next-line:no-any */
    const map = buildAuthorsAndAffiliations(objs as any)
    expect(map).toEqual({
      affiliations: new Map(Object.entries({ 'MPAffiliation:X': affiliation })),
      authorAffiliations: new Map(
        Object.entries({
          'MPContributor:y': [],
          'MPContributor:x': [{ data: affiliation, ordinal: 1 }],
          'MPContributor:z': [],
        })
      ),
      authors: buildSortedAuthors(authors),
    })
  })

  it('buildAuthorPriority', () => {
    const authors: Contributor[] = [
      {
        _id: 'MPContributor:author-1',
        objectType: ObjectTypes.Contributor,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-1',
          objectType: 'MPBibliographicName',
        },
        isJointContributor: false,
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
        priority: 0,
      },
      {
        _id: 'MPContributor:author-2',
        objectType: ObjectTypes.Contributor,
        manuscriptID: 'MPManuscript:manuscript-1',
        containerID: 'MPProject:project-1',
        bibliographicName: {
          _id: 'MPBibliographicName:author-2',
          objectType: 'MPBibliographicName',
        },
        sessionID: 'test',
        createdAt: 0,
        updatedAt: 0,
        priority: 1,
      },
    ]

    expect(buildAuthorPriority(authors)).toBe(2)
  })

  it('buildAuthorPriority', () => {
    const authors: Contributor[] = []

    expect(buildAuthorPriority(authors)).toBe(0)
  })

  it('buildAffiliationIDs', () => {
    expect(buildAffiliationIDs(contribs)).toEqual(['MPAffiliation:X'])
  })
})

describe('reorderAuthors', () => {
  const authors: Contributor[] = [
    {
      _id: 'MPContributor:author-1',
      objectType: ObjectTypes.Contributor,
      manuscriptID: 'MPManuscript:manuscript-1',
      containerID: 'MPProject:project-1',
      bibliographicName: {
        _id: 'MPBibliographicName:author-1',
        objectType: 'MPBibliographicName',
      },
      isJointContributor: false,
      sessionID: 'test',
      createdAt: 0,
      updatedAt: 0,
      priority: 0,
    },
    {
      _id: 'MPContributor:author-2',
      objectType: ObjectTypes.Contributor,
      manuscriptID: 'MPManuscript:manuscript-1',
      containerID: 'MPProject:project-1',
      bibliographicName: {
        _id: 'MPBibliographicName:author-2',
        objectType: 'MPBibliographicName',
      },
      sessionID: 'test',
      createdAt: 0,
      updatedAt: 0,
      priority: 1,
    },
  ]

  it('should reorder authors based on a source and destination index', () => {
    const result = reorderAuthors(authors, 1, -0.5)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual(authors[1])
  })

  it('should reorder authors in either direction', () => {
    const result = reorderAuthors(authors, 0, 1.5)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual(authors[1])
  })

  it('should not reorder authors if the new index puts it in the same order', () => {
    const result = reorderAuthors(authors, 0, 0.5)
    expect(result).toEqual(authors)
  })
})
