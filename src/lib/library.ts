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

const buildKeywordMatches = (
  keyword: string,
  library: Map<string, BibliographyItem>
) => {
  const output: BibliographyItem[] = []

  for (const item of library.values()) {
    const ids = item.keywordIDs as string[] | null

    if (ids && ids.includes(keyword)) {
      output.push(item)
    }
  }

  return output
}

const buildTextMatches = (
  match: string,
  library: Map<string, BibliographyItem>
) => {
  const output: BibliographyItem[] = []

  for (const item of library.values()) {
    if (item.title && item.title.toLowerCase().indexOf(match) !== -1) {
      output.push(item)
    }
  }

  return output
}

const mergeKeywordAndQueryMatches = (
  query: string | null,
  keywordMatches: Set<BibliographyItem>,
  queryMatches: Set<BibliographyItem>,
  library: Map<string, BibliographyItem> | null,
  keywords?: Set<string>
): Set<BibliographyItem> => {
  let mergedSet: Set<BibliographyItem> = new Set<BibliographyItem>()
  const isQueryUsed = query && query.length > 0
  const isKeywordsUsed = keywords && keywords.size > 0

  if (isQueryUsed) {
    if (isKeywordsUsed) {
      queryMatches.forEach(match => {
        if (keywordMatches.has(match)) {
          mergedSet.add(match)
        }
      })
    } else {
      mergedSet = queryMatches
    }
  } else {
    if (isKeywordsUsed) {
      keywordMatches.forEach(value => {
        mergedSet.add(value)
      })
    } else {
      if (library) {
        Array.from(library.values()).forEach(value => {
          mergedSet.add(value)
        })
      }
    }
  }
  return mergedSet
}

export const filterLibrary = (
  library: Map<string, BibliographyItem> | null,
  query: string | null,
  keywords?: Set<string>
): BibliographyItem[] => {
  if (!library) return []

  if (!query && !keywords) return Array.from(library.values())

  const queryMatches: Set<BibliographyItem> = new Set<BibliographyItem>()
  const keywordMatches: Set<BibliographyItem> = new Set<BibliographyItem>()

  if (query) {
    buildTextMatches(query.toLowerCase(), library).forEach(match =>
      queryMatches.add(match)
    )
  }

  if (keywords) {
    keywords.forEach(value => {
      const matches: BibliographyItem[] = buildKeywordMatches(value, library)
      matches.forEach(match => {
        keywordMatches.add(match)
      })
    })
  }

  return Array.from(
    mergeKeywordAndQueryMatches(
      query,
      keywordMatches,
      queryMatches,
      library,
      keywords
    )
  )
}

export const issuedYear = (item: Partial<BibliographyItem>): string | null => {
  if (
    !item.issued ||
    !item.issued['date-parts'] ||
    !item.issued['date-parts'][0] ||
    !item.issued['date-parts'][0][0]
  ) {
    return null
  }

  const year = item.issued['date-parts'][0][0]

  return `(${year}) `
}

const firstAuthorName = (
  item: Partial<BibliographyItem>
): string | null | undefined => {
  if (!item) return null
  if (!item.author) return null
  if (!item.author.length) return null

  const author = item.author[0]

  return author.family || author.literal || author.given
}

const generateItemIdentifier = (item: Partial<BibliographyItem>) =>
  JSON.stringify({
    title: item.title,
    author: firstAuthorName(item),
    year: issuedYear(item),
  })

export const estimateID = (item: Partial<BibliographyItem>) => {
  if (item.DOI) {
    return item.DOI
  }

  return generateItemIdentifier(item)
}

export const shortAuthorsString = (item: Partial<BibliographyItem>) => {
  const authors = (item.author || []).map(
    author => author.family || author.literal || author.given
  )

  if (authors.length > 1) {
    if (authors.length > 3) {
      authors.splice(2, authors.length - 3)
    }

    const lastAuthors = authors.splice(-2)
    authors.push(lastAuthors.join(' & '))
  }

  return authors.join(', ')
}
