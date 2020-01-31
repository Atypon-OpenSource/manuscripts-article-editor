/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

// this module follows a pattern established by parser modules in astrocite.

import { CSL } from '@manuscripts/manuscript-transform'

const FIELD_MAPS: Map<string, keyof CSL.Item> = new Map([
  ['title', 'title'],
  ['publisher', 'publisher'],
  ['url', 'URL'],
  ['volume', 'volume'],
  ['number', 'issue'],
  ['doi', 'DOI'],
  ['bundle/publication/title', 'container-title'],
])

const TYPE_MAP: Map<number, CSL.ItemType> = new Map([
  [0, 'book'],
  [400, 'article-journal'],
])

export const parse = (xml: string): CSL.Item[] => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')

  // @ts-ignore
  // tslint:disable-next-line:no-any
  const FIELD_TRANSFORMS: Map<keyof CSL.Item, (node: Node) => any> = new Map([
    [
      'type',
      node => {
        const type = evaluateXPathToString('type', node)

        if (type === '') {
          return
        }

        return TYPE_MAP.get(Number(type))
      },
    ],
    [
      'author',
      node => {
        const authorNodes = evaluateXPathToNodes('authors/author', node)

        if (!authorNodes.length) {
          return
        }

        const items: CSL.Name[] = []

        for (const authorNode of authorNodes) {
          items.push({
            given: [
              evaluateXPathToString('firstName', authorNode),
              evaluateXPathToString('middleNames', authorNode),
            ]
              .filter(Boolean)
              .join(' '),
            family: evaluateXPathToString('lastName', authorNode),
          })
        }

        return items
      },
    ],
    [
      'page',
      node => {
        const startPage = evaluateXPathToString('startpage', node)

        if (startPage === '') {
          return
        }

        const parts = [startPage]

        const endPage = evaluateXPathToString('endpage', node)

        if (endPage !== '') {
          parts.push(endPage)
        }

        return parts.join('-')
      },
    ],
    [
      'issued',
      node => {
        const publicationDate = evaluateXPathToString('publication_date', node)

        const matches = publicationDate.match(/^99(\d{4})(\d{2})(\d{2})/)

        if (!matches) {
          return
        }

        const [year, month, day] = matches.slice(1).map(Number)

        const parts: number[] = []

        if (year) {
          parts.push(year)
        }

        if (month >= 1 && month <= 12) {
          parts.push(month)
        }

        if (day >= 1 && day <= 31) {
          parts.push(day)
        }

        return {
          'date-parts': [parts],
        }
      },
    ],
  ])

  const evaluateXPathToNodes = (xpath: string, contextNode: Node): Node[] => {
    const result = doc.evaluate(
      xpath,
      contextNode,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    )

    const nodes: Node[] = []

    for (let i = 0; i < result.snapshotLength; i++) {
      nodes.push(result.snapshotItem(i)!)
    }

    return nodes
  }

  const evaluateXPathToString = (xpath: string, contextNode: Node): string =>
    doc.evaluate(
      `string(${xpath})`,
      contextNode,
      null,
      XPathResult.STRING_TYPE,
      null
    ).stringValue

  const parseItem = (node: Node): CSL.Item => {
    const output: Partial<CSL.Item> = {}

    for (const [key, transform] of FIELD_TRANSFORMS.entries()) {
      const result = transform(node)

      if (result !== undefined) {
        output[key] = result
      }
    }

    for (const [xpath, key] of FIELD_MAPS.entries()) {
      const result = evaluateXPathToString(xpath, node)

      if (result !== '') {
        // tslint:disable-next-line:no-any
        output[key] = result as any
      }
    }

    return output as CSL.Item
  }

  const publicationNodes = evaluateXPathToNodes(
    '/citation/publications/publication',
    doc
  )

  return publicationNodes.map(parseItem)
}
