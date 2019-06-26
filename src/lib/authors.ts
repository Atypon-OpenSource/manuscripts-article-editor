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

import { getModelsByType } from '@manuscripts/manuscript-transform'
import {
  Affiliation,
  Contributor,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'

export type AffiliationMap = Map<string, Affiliation>

export const buildSortedAuthors = (modelMap: Map<string, Model>) => {
  return getModelsByType<Contributor>(modelMap, ObjectTypes.Contributor)
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
  modelMap: Map<string, Model>
): AffiliationMap =>
  new Map(
    affiliationIDs.map((id: string): [string, Affiliation] => [
      id,
      modelMap.get(id) as Affiliation,
    ])
  )

export const buildAuthorsAndAffiliations = (modelMap: Map<string, Model>) => {
  const authors = buildSortedAuthors(modelMap)
  const affiliationIDs = buildAffiliationIDs(authors)
  const affiliations = buildAffiliationsMap(affiliationIDs, modelMap)

  const authorAffiliations = buildAuthorAffiliations(
    authors,
    affiliations,
    affiliationIDs
  )

  return {
    affiliations,
    authors,
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
