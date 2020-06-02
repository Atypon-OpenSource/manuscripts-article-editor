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

import { convertDataToBibliographyItem } from '@manuscripts/manuscript-editor'
import { CSL } from '@manuscripts/manuscript-transform'
import { BibliographyItem } from '@manuscripts/manuscripts-json-schema'

const chooseParser = (format: string) => {
  format = format.replace(/^application\/(x-)?/, '')

  switch (format) {
    case '.bib':
    case 'bibtex':
      return import('astrocite-bibtex')

    case '.ris':
    case 'research-info-systems':
      return import('astrocite-ris')

    case 'papers-citations-xml':
      return import('./papers-citations')

    case 'citeproc+json':
      return Promise.resolve({
        parse: JSON.parse,
      })

    default:
      throw new Error(`Unknown citation format ${format}`)
  }
}

const validRISLine = /^(\w{2}\s{2}-\s.+|ER\s{2}-\s*)$/

export const transformBibliography = async (
  data: string,
  extension: string
): Promise<Array<Partial<BibliographyItem>>> => {
  const { parse } = await chooseParser(extension)

  if (extension === '.ris') {
    // remove invalid lines
    data = data
      .split(/[\n\r]+/)
      .filter(line => validRISLine.test(line))
      .join('\n')
  }

  const items = parse(data) as CSL.Item[]

  return items.map(convertDataToBibliographyItem)
}

// tslint:disable-next-line:cyclomatic-complexity
export const matchLibraryItemByIdentifier = (
  item: BibliographyItem,
  library: Map<string, BibliographyItem>
): BibliographyItem | undefined => {
  if (library.has(item._id)) {
    return library.get(item._id)
  }

  if (item.DOI) {
    const doi = item.DOI.toLowerCase()

    for (const model of library.values()) {
      if (model.DOI && model.DOI.toLowerCase() === doi) {
        return model
      }
    }
  }

  if (item.PMID) {
    for (const model of library.values()) {
      if (model.PMID && model.PMID === item.PMID) {
        return model
      }
    }
  }

  if (item.URL) {
    const url = item.URL.toLowerCase()

    for (const model of library.values()) {
      if (model.URL && model.URL.toLowerCase() === url) {
        return model
      }
    }
  }
}

export const bibliographyItemTypes = new Map<string, string>([
  ['article', 'Article'],
  ['article-journal', 'Journal Article'],
  ['article-magazine', 'Magazine Article'],
  ['article-newspaper', 'Newspaper Article'],
  ['bill', 'Bill'],
  ['book', 'Book'],
  ['broadcast', 'Broadcast'],
  ['chapter', 'Chapter'],
  ['dataset', 'Dataset'],
  ['entry', 'Entry'],
  ['entry-dictionary', 'Dictionary Entry'],
  ['entry-encyclopedia', 'Encyclopedia Entry'],
  ['figure', 'Figure'],
  ['graphic', 'Graphic'],
  ['interview', 'Interview'],
  ['legal_case', 'Legal Case'],
  ['legislation', 'Legislation'],
  ['manuscript', 'Manuscript'],
  ['map', 'Map'],
  ['motion_picture', 'Motion Picture'],
  ['musical_score', 'Musical Score'],
  ['pamphlet', 'Pamphlet'],
  ['paper-conference', 'Conference Paper'],
  ['patent', 'Patent'],
  ['personal_communication', 'Personal Communication'],
  ['post', 'Post'],
  ['post-weblog', 'Blog Post'],
  ['report', 'Report'],
  ['review', 'Review'],
  ['review-book', 'Book Review'],
  ['song', 'Song'],
  ['speech', 'Speech'],
  ['thesis', 'Thesis'],
  ['treaty', 'Treaty'],
  ['webpage', 'Web Page'],
])
