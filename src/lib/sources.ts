import { crossref, datacite } from '@manuscripts/manuscript-editor'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'

export interface LibrarySource {
  id: string
  name: string
  fetch?: (item: BibliographyItem) => Promise<Partial<BibliographyItem>>
  search?: (
    query: string,
    limit: number
  ) => Promise<{
    items: Array<Partial<BibliographyItem>>
    total: number
  }>
}

export const sources: LibrarySource[] = [
  {
    id: 'library',
    name: 'Library',
  },
  {
    id: 'crossref',
    name: 'Crossref',
    search: crossref.search,
    fetch: crossref.fetch,
  },
  {
    id: 'datacite',
    name: 'DataCite',
    search: datacite.search,
    fetch: datacite.fetch,
  },
]
