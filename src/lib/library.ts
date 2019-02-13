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

export const filterLibrary = (
  library: Map<string, BibliographyItem> | null,
  query: string | null
): BibliographyItem[] => {
  if (!library) return []

  if (!query) return Array.from(library.values())

  const matches = query.match(/^keyword:(.+)/)

  if (matches) {
    return buildKeywordMatches(matches[1], library)
  }

  return buildTextMatches(query.toLowerCase(), library)
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
    (author, index) => author.family || author.literal || author.given
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
