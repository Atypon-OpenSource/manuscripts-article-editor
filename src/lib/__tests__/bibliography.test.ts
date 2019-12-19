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

import fs from 'fs'
import { transformBibliography } from '../bibliography'

describe('importer', () => {
  test('imports a BibTeX file', async () => {
    const data = fs.readFileSync(
      __dirname + '/../__fixtures__/lens-export.bib',
      'utf8'
    )

    const response = await transformBibliography(data, '.bib')

    expect(response).toHaveLength(72)

    response.forEach(item => {
      if (item.number) {
        expect(typeof item.number).toBe('number')
      }
      if (item['number-of-pages']) {
        expect(typeof item['number-of-pages']).toBe('number')
      }
    })
  })

  test('imports a RIS file', async () => {
    const data = fs.readFileSync(
      __dirname + '/../__fixtures__/lens-export.ris',
      'utf8'
    )

    const response = await transformBibliography(data, '.ris')

    expect(response).toHaveLength(41)

    response.forEach(item => {
      if (item.number) {
        expect(typeof item.number).toBe('number')
      }
      if (item['number-of-pages']) {
        expect(typeof item['number-of-pages']).toBe('number')
      }
    })
  })

  test('imports a RIS file with line feeds', async () => {
    const data = fs.readFileSync(
      __dirname + '/../__fixtures__/line-feed.ris',
      'utf8'
    )

    expect(data).toMatch(/\r/)

    const response = await transformBibliography(data, '.ris')

    expect(response).toHaveLength(1)

    const [item] = response

    expect(item.DOI).toBe('10.5849/forsci.13-022')
  })

  test('imports a RIS file with empty fields', async () => {
    const data = `TY  - JOUR
AU  - Stephenson, N. L.
AU  - Das, A. J.
TI  - Rate of tree carbon accumulation increases continuously with tree size
JO  - Nature
PY  - 2014/01/15/online
VL  - 507
SP  - 90
EP  -
PB  - Nature Publishing Group, a division of Macmillan Publishers Limited. All Rights Reserved.
SN  -
UR  - https://doi.org/10.1038/nature12914
L3  - 10.1038/nature12914
M3  -
L3  - https://www.nature.com/articles/nature12914#supplementary-information
ER  -
`

    const response = await transformBibliography(data, '.ris')

    expect(response).toHaveLength(1)

    const [item] = response
    expect(Object.keys(item)).toHaveLength(10)
  })
})
