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

import { hasObjectType } from '@manuscripts/manuscript-transform'
import {
  Affiliation,
  Contributor,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import { ContributorRole, hasRole } from './roles'

export type AffiliationMap = Map<string, Affiliation>

interface AffiliationData {
  ordinal: number
  data: Affiliation
}

export interface AuthorData {
  authors: Contributor[]
  affiliations: AffiliationMap
  authorAffiliations: Map<string, AffiliationData[]>
}

const sortContributorsByPriority = (a: Contributor, b: Contributor) =>
  Number(a.priority) - Number(b.priority)

export const buildSortedAuthors = (contributors: Contributor[]) =>
  contributors
    .filter(hasRole(ContributorRole.author))
    .sort(sortContributorsByPriority)

export const buildAuthorPriority = (authors: Contributor[]) => {
  if (!authors.length) return 0

  const priorities = authors.map(author => Number(author.priority))

  return Math.max(...priorities) + 1
}

export const buildSortedAffiliationIDs = (
  sortedAuthors: Contributor[]
): string[] => {
  const ids = new Set<string>()

  for (const author of sortedAuthors) {
    if (author.affiliations) {
      author.affiliations.forEach(id => {
        ids.add(id)
      })
    }
  }

  return [...ids]
}

export const buildAuthorAffiliations = (
  authors: Contributor[],
  affiliations: AffiliationMap,
  sortedAffiliationIDs: string[]
) => {
  const items = new Map<string, AffiliationData[]>()

  for (const author of authors) {
    items.set(
      author._id,
      (author.affiliations || []).map(id => {
        return {
          ordinal: sortedAffiliationIDs.indexOf(id) + 1,
          data: affiliations.get(id) as Affiliation,
        }
      })
    )
  }

  return items
}

export const buildAffiliationsMap = (
  affiliationIDs: string[],
  affiliations: Affiliation[]
): AffiliationMap =>
  new Map(
    affiliationIDs.map((id: string): [string, Affiliation] => [
      id,
      affiliations.find(affiliation => affiliation._id === id) as Affiliation,
    ])
  )

const isContributor = hasObjectType<Contributor>(ObjectTypes.Contributor)
const isAffiliation = hasObjectType<Affiliation>(ObjectTypes.Affiliation)

export const buildAuthorsAndAffiliations = (
  data: Array<Contributor | Affiliation>
) => {
  const authors = data.filter(isContributor)
  const affiliations = data.filter(isAffiliation)
  const sortedAuthors = buildSortedAuthors(authors)
  const sortedAffiliationIDs = buildSortedAffiliationIDs(sortedAuthors)
  const affiliationsMap = buildAffiliationsMap(
    sortedAffiliationIDs,
    affiliations
  )

  const authorAffiliations = buildAuthorAffiliations(
    sortedAuthors,
    affiliationsMap,
    sortedAffiliationIDs
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
