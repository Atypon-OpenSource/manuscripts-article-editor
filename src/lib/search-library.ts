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
import fuzzysort from 'fuzzysort'

const hasFilter = (filters: Set<string>, keywordIDs?: string[]) => {
  if (!keywordIDs) {
    return false
  }

  for (const keywordID of keywordIDs) {
    if (filters.has(keywordID)) {
      return true
    }
  }

  return false
}

const newestFirst = (a: BibliographyItem, b: BibliographyItem) => {
  if (a.createdAt === b.createdAt) {
    return 0
  }

  if (!a.createdAt) {
    return -1
  }

  if (!b.createdAt) {
    return 1
  }

  return b.createdAt - a.createdAt
}

const prepareBibliographyItem = (
  item: BibliographyItem
): SearchableBibliographyItem => {
  const output: SearchableBibliographyItem = { ...item }

  // add "authors" string containing all author names
  if (output.author) {
    output.authors = output.author
      .map(author => [author.given, author.family].join(' '))
      .join(', ')
  }

  return output
}

interface SearchableBibliographyItem extends BibliographyItem {
  authors?: string
}

let sortPromise: Fuzzysort.CancelablePromise<Fuzzysort.KeysResults<
  BibliographyItem
>>

// tslint:disable-next-line:cyclomatic-complexity
export const filterLibrary = async (
  library?: Map<string, BibliographyItem>,
  query?: string,
  filters?: Set<string>
): Promise<BibliographyItem[]> => {
  if (sortPromise) {
    sortPromise.cancel()
  }

  if (!library) {
    return []
  }

  if (!query && !filters) {
    const items = Array.from(library.values())
    items.sort(newestFirst)
    return items
  }

  const filteredItems: BibliographyItem[] = []

  for (const item of library.values()) {
    if (!filters || hasFilter(filters, item.keywordIDs)) {
      filteredItems.push(item)
    }
  }

  if (!query) {
    return filteredItems
  }

  const preparedItems = filteredItems.map(prepareBibliographyItem)

  sortPromise = fuzzysort.goAsync<BibliographyItem>(query, preparedItems, {
    keys: ['title', 'authors'],
    limit: 100,
    allowTypo: false,
    threshold: -1000,
  })

  const results = await sortPromise

  const output = results.map(result => result.obj)

  output.sort(newestFirst)

  return output
}
