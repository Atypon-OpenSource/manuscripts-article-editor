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

import projectDump from '@manuscripts/examples/data/project-dump.json'
import { Manuscript, ObjectTypes } from '@manuscripts/manuscripts-json-schema'
import { AxiosResponse, ResponseType } from 'axios'
import JSZip from 'jszip'
import { buildProjectBundle, removeUnsupportedData } from '../exporter'
import { ProjectDump, readProjectDumpFromArchive } from '../importers'
import { convert } from '../pressroom'
import { getAttachment } from './attachments'
import { buildModelMap } from './util'

jest.unmock('axios')
jest.unmock('../pressroom')

// allow 10 minutes for tests to complete
jest.setTimeout(1000 * 60 * 10)

jest.mock('../pressroom', () => ({
  convert: jest.fn(async (data: FormData, format: string) => {
    const { default: config } = await import('../../config')
    const { default: axios } = await import('axios')
    const { default: toBuffer } = await import('blob-to-buffer')
    const { default: NodeFormData } = await import('form-data')

    const fileToBuffer = (file: File): Promise<Buffer> =>
      new Promise((resolve, reject) => {
        toBuffer(file, (err, buffer) => {
          if (err) {
            reject(err)
          } else {
            resolve(buffer)
          }
        })
      })

    const file = data.get('file') as File
    const buffer = await fileToBuffer(file)

    const formData = new NodeFormData()
    formData.append('file', buffer, file.name)

    return axios.post<ArrayBuffer>(
      '/v1/document/compile',
      formData.getBuffer(),
      {
        baseURL: config.pressroom.url,
        // responseType: 'stream' as ResponseType,
        responseType: 'arraybuffer' as ResponseType,
        headers: {
          'Pressroom-API-Key': config.pressroom.key,
          'Pressroom-Target-File-Extension': format.replace(/^\./, ''),
          'Pressroom-Regenerate-Project-Bundle-Model-Object-IDs': 1,
          ...formData.getHeaders(),
        },
      }
    )
  }),
}))

describe('importer', () => {
  test('imports a manuproj file', async () => {
    const findManuscript = (projectDump: ProjectDump) =>
      projectDump.data.find(
        item => item.objectType === ObjectTypes.Manuscript
      ) as Manuscript

    const manuscript = findManuscript(projectDump)

    const modelMap = buildModelMap(projectDump as ProjectDump)

    const zip = await buildProjectBundle(
      getAttachment,
      modelMap,
      manuscript._id,
      '.manuproj'
    )

    await removeUnsupportedData(zip)

    const blob = await zip.generateAsync({ type: 'blob' })
    const file = new File([blob], 'example.manuproj')

    const form = new FormData()
    form.append('file', file)

    console.log('Importing empty manuscript') // tslint:disable-line:no-console

    // @ts-ignore: mocked convert function returns the response, not the blob
    const response: AxiosResponse<ArrayBuffer> = await convert(
      form,
      '.manuproj'
    )
    expect(response.status).toBe(200)
    expect(response.statusText).toBe('OK')
    expect(response.data).not.toBeUndefined()

    const archive = await new JSZip().loadAsync(response.data)
    const output = await readProjectDumpFromArchive(archive)
    const outputManuscript = findManuscript(output)

    expect(outputManuscript).not.toBeUndefined()
    expect(outputManuscript._id).not.toBe(manuscript._id) // ensure a new id has been generated
  })
})
