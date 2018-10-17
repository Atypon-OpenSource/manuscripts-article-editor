import * as crossref from '../editor/lib/crossref'
import * as datacite from '../editor/lib/datacite'
import { BibliographyItem } from '../types/models'

export interface LibrarySource {
  id: string
  name: string
  fetch?: (item: BibliographyItem) => Promise<Partial<BibliographyItem>>
  search?: (
    query: string,
    limit: number
  ) => Promise<Array<Partial<BibliographyItem>>>
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
