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

import { crossref, datacite } from '@manuscripts/manuscript-editor'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'

export interface LibrarySource {
  id: string
  name: string
  fetch?: (doi: string, mailto: string) => Promise<Partial<BibliographyItem>>
  search?: (
    query: string,
    limit: number,
    mailto: string
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
