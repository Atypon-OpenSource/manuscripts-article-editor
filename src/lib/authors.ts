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
  ContributorRole,
  Model,
  ObjectTypes,
} from '@manuscripts/json-schema'
import { hasObjectType } from '@manuscripts/transform'

import { ascendingPriority } from './sort'

export type AffiliationMap = Map<string, Affiliation>

export interface AffiliationData {
  ordinal: number
  data: Affiliation
}

export const buildSortedContributors = (contributors: Contributor[]) =>
  contributors.sort(ascendingPriority)

export const buildAuthorPriority = (authors: Contributor[]) => {
  if (!authors.length) {
    return 0
  }

  const priorities = authors.map((author) => Number(author.priority))

  return Math.max(...priorities) + 1
}

export const buildSortedAffiliationIDs = (
  sortedAuthors: Contributor[]
): string[] => {
  const ids = new Set<string>()

  for (const author of sortedAuthors) {
    if (author.affiliations) {
      author.affiliations.forEach((id) => {
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
  const sortedAffs = Array.from(affiliations.values())

  for (const author of authors) {
    items.set(
      author._id,
      (author.affiliations || []).map((id) => {
        return {
          ordinal: sortedAffiliationIDs.indexOf(id) + 1,
          data: sortedAffs.find((af) => af._id.startsWith(id)) as Affiliation,
        }
      })
    )
  }

  return items
}

function createInvalidAffillation(id: string) {
  return {
    priority: 0,
    manuscriptID: '',
    containerID: '',
    _id: id,
    objectType: 'MPAffiliation',
    createdAt: 0,
    updatedAt: 0,
  } as Affiliation
}

export const buildAffiliationsMap = (
  affiliationIDs: string[],
  affiliations: Affiliation[]
): AffiliationMap =>
  new Map(
    affiliationIDs.map((id: string): [string, Affiliation] => {
      let associatedItem = affiliations.find((affiliation) =>
        affiliation._id.startsWith(id)
      )

      // this provides loose id referencing for cases when affiliation is rejected in track changes and doesn't exist anymore in the modelMap
      associatedItem = associatedItem || createInvalidAffillation(id)

      return [id, associatedItem]
    })
  )

const isContributor = hasObjectType<Contributor>(ObjectTypes.Contributor)
const isAffiliation = hasObjectType<Affiliation>(ObjectTypes.Affiliation)

export const getMetaData = (modelMap: Map<string, Model>) => {
  const affiliationAndContributors: (Contributor | Affiliation)[] = []
  const contributorRoles: ContributorRole[] = []

  if (modelMap) {
    for (const model of modelMap.values()) {
      if (
        model.objectType === ObjectTypes.Affiliation ||
        model.objectType === ObjectTypes.Contributor
      ) {
        affiliationAndContributors.push(model as Affiliation) // or Contributor
      }
      if (model.objectType === ObjectTypes.ContributorRole) {
        contributorRoles.push(model as ContributorRole)
      }
    }
    return {
      authorsAndAffiliations: buildAuthorsAndAffiliations(
        affiliationAndContributors
      ),
      contributorRoles: contributorRoles,
    }
  }
}

export const buildAuthorsAndAffiliations = (
  data: Array<Contributor | Affiliation>
) => {
  const authors = data.filter(isContributor)
  const affiliations = data.filter(isAffiliation)
  const sortedAuthors = buildSortedContributors(authors)
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
