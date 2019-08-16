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
