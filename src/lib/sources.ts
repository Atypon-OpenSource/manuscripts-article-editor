import * as crossref from '../editor/lib/crossref'
import * as datacite from '../editor/lib/datacite'
import { LibrarySource } from '../types/library'

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
