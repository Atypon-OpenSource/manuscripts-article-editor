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

import {
  Affiliation,
  Contributor,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'

export type AffiliationMap = Map<string, Affiliation>

export interface AuthorData {
  authors: Contributor[]
  affiliations: AffiliationMap
  authorAffiliations: Map<string, Array<{ ordinal: number; data: Affiliation }>>
}

export const buildSortedAuthors = (contributors: Contributor[]) => {
  return contributors
    .filter(item => item.role === 'author')
    .sort((a, b) => Number(a.priority) - Number(b.priority))
}

export const buildAuthorPriority = (authors: Contributor[]) => {
  if (!authors.length) return 0

  const priorities = authors.map(author => Number(author.priority))

  return Math.max(...priorities) + 1
}

export const buildAffiliationIDs = (authors: Contributor[]): string[] => {
  const ids: string[] = []

  authors.forEach(author => {
    if (author.affiliations) {
      author.affiliations.forEach(id => {
        ids.push(id)
      })
    }
  })

  return ids.filter((value, index) => ids.indexOf(value) === index)
}

export const buildAuthorAffiliations = (
  authors: Contributor[],
  affiliations: AffiliationMap,
  uniqueAffiliationIDs: string[]
) => {
  const items = new Map()

  authors.forEach(author => {
    items.set(
      author._id,
      (author.affiliations || []).map(id => {
        return {
          ordinal: uniqueAffiliationIDs.indexOf(id) + 1,
          data: affiliations.get(id) as Affiliation,
        }
      })
    )
  })

  return items
}

export const buildAffiliationsMap = (
  affiliationIDs: string[],
  affiliations: Affiliation[]
): AffiliationMap =>
  new Map(
    affiliationIDs.map((id: string): [string, Affiliation] => [
      id,
      affiliations.find(aff => aff._id === id) as Affiliation,
    ])
  )

export const buildAuthorsAndAffiliations = (
  data: Array<Contributor | Affiliation>
) => {
  const authors = data.filter(
    model => model.objectType === ObjectTypes.Contributor
  ) as Contributor[]
  const affiliations = data.filter(
    model => model.objectType === ObjectTypes.Affiliation
  ) as Affiliation[]
  const sortedAuthors = buildSortedAuthors(authors)
  const affiliationIDs = buildAffiliationIDs(authors)
  const affiliationsMap = buildAffiliationsMap(affiliationIDs, affiliations)

  const authorAffiliations = buildAuthorAffiliations(
    sortedAuthors,
    affiliationsMap,
    affiliationIDs
  )

  return {
    affiliations: affiliationsMap,
    authors: sortedAuthors,
    authorAffiliations,
  }
}

export const isJointFirstAuthor = (authors: Contributor[], index: number) => {
  const author = index === 0 ? authors[index] : authors[index - 1]

  return Boolean(author.isJointContributor)
}

export const reorderAuthors = (
  authors: Contributor[],
  oldIndex: number,
  newIndex: number
) => {
  const clonedAuthors = authors.slice(0)
  const order = authors.map((_, i) => (i === oldIndex ? newIndex : i))
  clonedAuthors.sort((a, b) => {
    return order[authors.indexOf(a)] - order[authors.indexOf(b)]
  })
  return clonedAuthors
}
