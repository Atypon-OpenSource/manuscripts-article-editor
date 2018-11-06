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
  library: Map<string, BibliographyItem>,
  query: string
): BibliographyItem[] => {
  if (!query) return Array.from(library.values())

  if (!library) return []

  const matches = query.match(/^keyword:(.+)/)

  if (matches) {
    return buildKeywordMatches(matches[1], library)
  }

  return buildTextMatches(query.toLowerCase(), library)
}
