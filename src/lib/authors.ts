import { getComponentsByType } from '../transformer/decode'
import { CONTRIBUTOR } from '../transformer/object-types'
import { Affiliation, ComponentMap, Contributor } from '../types/components'

export type AffiliationMap = Map<string, Affiliation>

export const buildSortedAuthors = (componentMap: ComponentMap) => {
  return getComponentsByType<Contributor>(componentMap, CONTRIBUTOR)
    .filter(item => item.role === 'author')
    .sort((a, b) => Number(a.priority) - Number(b.priority))
}

export const buildAuthorPriority = (authors: Contributor[]) => {
  if (!authors.length) return 0

  const priorities = authors.map(author => author.priority!)

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
  componentMap: ComponentMap
): AffiliationMap =>
  new Map(
    affiliationIDs.map(
      (id: string): [string, Affiliation] => [
        id,
        componentMap.get(id) as Affiliation,
      ]
    )
  )

export const buildAuthorsAndAffiliations = (componentMap: ComponentMap) => {
  const authors = buildSortedAuthors(componentMap)
  const affiliationIDs = buildAffiliationIDs(authors)
  const affiliations = buildAffiliationsMap(affiliationIDs, componentMap)

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
