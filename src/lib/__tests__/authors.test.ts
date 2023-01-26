/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import { Affiliation, Contributor } from '@manuscripts/json-schema'
import {
  Build,
  buildAffiliation,
  buildBibliographicName,
  buildContributor,
} from '@manuscripts/transform'

import {
  buildAuthorPriority,
  buildAuthorsAndAffiliations,
  buildSortedAffiliationIDs,
  buildSortedContributors,
  isJointFirstAuthor,
  reorderAuthors,
} from '../authors'

const data: {
  authors: Array<Build<Contributor>>
  affiliations: Array<Build<Affiliation>>
} = {
  authors: [
    buildContributor(
      buildBibliographicName({
        given: 'Rosie',
        family: 'Rhodes',
      }),
      'author',
      3
    ),
    buildContributor(
      buildBibliographicName({
        given: 'Isabelle',
        family: 'Gardner',
      }),
      'author',
      1
    ),
    buildContributor(
      buildBibliographicName({
        given: 'Imogen',
        family: 'Gibbs',
      }),
      'author',
      2
    ),
  ],
  affiliations: [
    buildAffiliation('University of Birmingham'),
    buildAffiliation('University of Leicester'),
    buildAffiliation('University of Edinburgh'),
  ],
}

describe('authors', () => {
  test('sort by priority', () => {
    const contributors = [...data.authors] as Contributor[]

    const result = buildSortedContributors(contributors)

    const priorities = result.map((contributor) => contributor.priority)

    expect(priorities).toStrictEqual([1, 2, 3])
  })

  test('calculate next priority when no authors', () => {
    const result = buildAuthorPriority([])

    expect(result).toBe(0)
  })

  test('calculate next priority', () => {
    const authors = [...data.authors] as Contributor[]

    const result = buildAuthorPriority(authors)

    expect(result).toBe(4)
  })

  test('build affiliation ids from sorted authors', () => {
    const authors = [...data.authors] as Contributor[]
    const affiliations = [...data.affiliations] as Affiliation[]

    authors[0].affiliations = [affiliations[1]._id, affiliations[2]._id]
    authors[1].affiliations = [affiliations[1]._id]
    authors[2].affiliations = [
      affiliations[0]._id,
      affiliations[2]._id,
      affiliations[1]._id,
    ]

    const results = buildSortedAffiliationIDs(authors)

    expect(results).toStrictEqual([
      affiliations[1]._id,
      affiliations[2]._id,
      affiliations[0]._id,
    ])
  })

  test('build sorted author affiliations', () => {
    const authors = [...data.authors] as Contributor[]
    const affiliations = [...data.affiliations] as Affiliation[]

    authors[0].affiliations = [affiliations[1]._id, affiliations[2]._id]
    authors[1].affiliations = [affiliations[1]._id]
    authors[2].affiliations = [
      affiliations[0]._id,
      affiliations[2]._id,
      affiliations[1]._id,
    ]

    const result = buildAuthorsAndAffiliations([...authors, ...affiliations])

    expect(result.affiliations).toEqual(
      new Map([
        [affiliations[1]._id, affiliations[1]],
        [affiliations[0]._id, affiliations[0]],
        [affiliations[2]._id, affiliations[2]],
      ])
    )

    expect(result.authors).toEqual([authors[1], authors[2], authors[0]])

    expect(result.authorAffiliations).toEqual(
      new Map([
        [authors[1]._id, [{ data: affiliations[1], ordinal: 1 }]],
        [
          authors[2]._id,
          [
            { data: affiliations[0], ordinal: 2 },
            { data: affiliations[2], ordinal: 3 },
            { data: affiliations[1], ordinal: 1 },
          ],
        ],
        [
          authors[0]._id,
          [
            { data: affiliations[1], ordinal: 1 },
            { data: affiliations[2], ordinal: 3 },
          ],
        ],
      ])
    )
  })

  test('is joint first author', () => {
    const authors = [...data.authors] as Contributor[]

    expect(isJointFirstAuthor(authors, 0)).toBe(false)
    expect(isJointFirstAuthor(authors, 1)).toBe(false)
    expect(isJointFirstAuthor(authors, 2)).toBe(false)

    authors[0].isJointContributor = true
    expect(isJointFirstAuthor(authors, 0)).toBe(true)
    expect(isJointFirstAuthor(authors, 1)).toBe(true)
    expect(isJointFirstAuthor(authors, 2)).toBe(false)

    authors[1].isJointContributor = true
    expect(isJointFirstAuthor(authors, 0)).toBe(true)
    expect(isJointFirstAuthor(authors, 1)).toBe(true)
    expect(isJointFirstAuthor(authors, 2)).toBe(true)
  })

  test('should reorder authors based on a source and destination index', () => {
    const authors = [...data.authors] as Contributor[]
    const result = reorderAuthors(authors, 1, -0.5)
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual(authors[1])
  })

  test('should reorder authors in either direction', () => {
    const authors = [...data.authors] as Contributor[]
    const result = reorderAuthors(authors, 0, 1.5)
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual(authors[1])
  })

  test('should not reorder authors if the new index puts it in the same order', () => {
    const authors = [...data.authors] as Contributor[]
    const result = reorderAuthors(authors, 0, 0.5)
    expect(result).toEqual(authors)
  })
})
