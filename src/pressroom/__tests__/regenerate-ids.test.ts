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

import fs from 'fs'
import JSZip from 'jszip'

import {
  updateAttachments,
  updateIdentifiers,
} from '../../lib/update-identifiers'
import { readProjectDumpFromArchive } from '../importers'

const buffer = fs.readFileSync(__dirname + '/__fixtures__/example.manuproj')
const blob = new Blob([buffer])

describe('regenerate ids', () => {
  test('regenerates all ids', async () => {
    const zip = await new JSZip().loadAsync(blob)
    const { data } = await readProjectDumpFromArchive(zip)

    const idMap = await updateIdentifiers(data)

    expect(idMap.size).toBe(131)

    const keys = [...idMap.keys()]
    expect(keys).toMatchSnapshot()

    const values = [...idMap.values()]
    expect(values).not.toEqual(keys)
  })

  test('updates attachment file names', async () => {
    const zip = await new JSZip().loadAsync(blob)
    const { data } = await readProjectDumpFromArchive(zip)

    const idMap = await updateIdentifiers(data)
    await updateAttachments(zip, idMap)

    const result = Object.keys(zip.files)

    expect(result).toHaveLength(5)

    expect(result).toContain('index.manuscript-json')
    expect(result).toContain('Data/')
    expect(result).toContain('containers.json')

    expect(result).not.toContain(
      'Data/MPBundle_D01D05F3-9C1F-4424-85C4-817969C0B2BC'
    )
    expect(result).not.toContain(
      'Data/MPFigure_3DD0D874-52DF-4D0B-A39D-A12C19337438'
    )
  })
})
