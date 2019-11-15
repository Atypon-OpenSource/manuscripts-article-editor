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

jest.mock('../pressroom')

import data from '@manuscripts/examples/data/project-dump.json'
import { exportProject } from '../exporter'
import { importFile, openFilePicker, ProjectDump } from '../importers'
import { getAttachment } from './attachments'
import { buildModelMap } from './util'

// tslint:disable:no-any

const createFile = (format: string): File => {
  switch (format) {
    case '.docx': {
      const blob = new Blob([], {
        type:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      return new File([blob], 'example.docx')
    }

    case '.md': {
      const blob = new Blob([], {
        type: 'application/markdown',
      })

      return new File([blob], 'example.md')
    }

    default:
      throw new Error('Unknown format: ' + format)
  }
}

describe('Import', () => {
  test('Receive a file from a file picker', async () => {
    jest
      .spyOn(document, 'createElement')
      .mockImplementationOnce((tagName: string) => {
        expect(tagName).toBe('input')

        const element = document.createElement(tagName) as HTMLInputElement

        jest.spyOn(element, 'click').mockImplementation(() => {
          Object.defineProperty(element, 'files', {
            get: () => [createFile('.docx')],
          })

          element.dispatchEvent(new Event('change'))
        })

        return element
      })

    const file = await openFilePicker()

    expect(file.name).toBe('example.docx')
  })

  test('Receive no files from a file picker', async () => {
    jest
      .spyOn(document, 'createElement')
      .mockImplementationOnce((tagName: string) => {
        expect(tagName).toBe('input')

        const element = document.createElement(tagName) as HTMLInputElement

        jest.spyOn(element, 'click').mockImplementation(() => {
          element.dispatchEvent(new Event('change'))
        })

        return element
      })

    await expect(openFilePicker()).resolves.toBeUndefined()
  })

  test('Import a manuscript from a DOCX file', async () => {
    const modelMap = buildModelMap(data as ProjectDump)
    const manuscriptID = 'MPManuscript:8EB79C14-9F61-483A-902F-A0B8EF5973C9'

    // `result` is the blob that would be sent for conversion, echoed back
    const result = await exportProject(
      getAttachment,
      modelMap,
      manuscriptID,
      '.docx'
    )

    const file = new File([result], 'manuscript.docx', {
      type:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      lastModified: Date.now(),
    })

    const items = await importFile(file)

    items.forEach((item: any) => expect(item._id).toBeDefined())
    items.forEach((item: any) => expect(item.objectType).toBeDefined())
    items.forEach((item: any) => expect(item._rev).toBeUndefined())
    items.forEach((item: any) => expect(item.collection).toBeUndefined())
  })
})
