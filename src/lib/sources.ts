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

import CitationSourceDatabase from '@manuscripts/assets/react/CitationSourceDatabase'
import CitationSourceLIbrary from '@manuscripts/assets/react/CitationSourceLIbrary'
import { crossref, datacite } from '@manuscripts/manuscript-editor'
import { Build } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'
import { FunctionComponent } from 'react'

type SearchInterface = (
  query: string,
  limit: number,
  mailto: string
) => Promise<{
  items: Array<Build<BibliographyItem>>
  total: number
}>

export interface LibrarySource {
  id: string
  name: string
  parent: string | null
  icon?: FunctionComponent
  fetch?: (doi: string, mailto: string) => Promise<Partial<BibliographyItem>>
  search?: SearchInterface
}

export const sources: LibrarySource[] = [
  {
    id: 'library',
    name: 'Library',
    parent: null,
    icon: CitationSourceLIbrary,
  },
  {
    id: 'search',
    name: 'Search',
    parent: null,
    search: crossref.search,
    fetch: crossref.fetch,
    icon: CitationSourceDatabase,
  },
  {
    id: 'crossref',
    name: 'Crossref',
    parent: 'search',
    search: crossref.search,
    fetch: crossref.fetch,
  },
  {
    id: 'datacite',
    name: 'DataCite',
    parent: 'search',
    search: datacite.search as SearchInterface,
    fetch: datacite.fetch,
  },
]
