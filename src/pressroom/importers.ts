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

import {
  generateAttachmentFilename,
  ModelAttachment,
} from '@manuscripts/manuscript-transform'
import {
  Figure,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import JSZip from 'jszip'
import { flatMap } from 'lodash-es'
import { cleanItem } from './clean-item'
import { removeUnsupportedData } from './exporter'
import { convert } from './pressroom'

export interface JsonModel extends Model, ModelAttachment {
  _id: string
  bundled?: boolean
  collection?: string
  contentType?: string
}

export interface ProjectDump {
  version: string
  data: JsonModel[]
}

const modelHasObjectType = <T extends Model>(objectType: string) => (
  model: Model
): model is T => {
  return model.objectType === objectType
}

export const readManuscriptFromBundle = async (
  zip: JSZip
): Promise<ProjectDump> => {
  const json = await zip.file('index.manuscript-json').async('text')

  return JSON.parse(json)
}

const importProjectBundle = async (result: Blob) => {
  const zip = await new JSZip().loadAsync(result)

  const doc = await readManuscriptFromBundle(zip)

  if (doc.version !== '2.0') {
    throw new Error(`Unsupported version: ${doc.version}`)
  }

  // TODO: validate?
  // TODO: ensure default data is added

  const items = doc.data
    .filter(item => !item.bundled)
    .filter(item => item.objectType !== 'MPContentSummary')
    .filter(item => item._id)
    .map(item => cleanItem(item))

  const folder = zip.folder('Data')

  await Promise.all(
    items
      .filter(modelHasObjectType<Figure>(ObjectTypes.Figure))
      .map(async (item: JsonModel) => {
        const filename = generateAttachmentFilename(item._id)

        try {
          item.attachment = {
            id: 'image',
            type: item.contentType || 'image/png',
            data: await folder.file(filename).async('blob'),
          }
        } catch (error) {
          // tslint:disable-next-line:no-console
          console.error(`Could not retrieve attachment from zip: ${error}`)
          // continue without attachment
        }
      })
  )

  return items
}

const importConvertedFile = async (file: File) => {
  const form = new FormData()
  form.append('file', file)

  const result = await convert(form, '.manuproj')

  // download(result, 'manuscript.zip')

  return importProjectBundle(result)
}

interface FileType {
  extension: string
  mimetypes: string[]
  description: string
}

const fileTypes: FileType[] = [
  {
    extension: '.docx',
    mimetypes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    description: 'DOCX (Microsoft Word)',
  },
  {
    extension: '.doc',
    mimetypes: ['application/msword'],
    description: 'DOC (Microsoft Word)',
  },
  {
    extension: '.html',
    mimetypes: ['text/html'],
    description: 'HTML',
  },
  {
    extension: '.md',
    mimetypes: ['text/markdown', 'text/plain'],
    description: 'Markdown',
  },
  {
    extension: '.manuproj',
    mimetypes: ['application/zip'],
    description: 'Manuscripts Project Bundle',
  },
  {
    extension: '.latex',
    mimetypes: [
      'application/x-latex',
      'application/latex',
      'text/x-latex',
      'text/latex',
      'text/plain',
    ],
    description: 'LaTeX',
  },
  {
    extension: '.tex',
    mimetypes: [
      'application/x-tex',
      'application/tex',
      'text/x-tex',
      'text/tex',
      'text/plain',
    ],
    description: 'TeX',
  },
  {
    extension: '.zip',
    mimetypes: ['application/zip'],
    description: 'ZIP (containing Markdown or LaTeX)',
  },
]

export const acceptedFileExtensions = () => {
  return fileTypes.map(item => item.extension)
}

export const acceptedFileDescription = () => {
  return fileTypes.map(item => item.description)
}

export const acceptedMimeTypes = () => {
  return flatMap(fileTypes, item => item.mimetypes)
}

export const openFilePicker = (
  acceptedExtensions: string[] = acceptedFileExtensions()
): Promise<File> =>
  new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = acceptedExtensions.join(',')

    const handleFocus = () => {
      window.removeEventListener('focus', handleFocus)

      // This event is fired before the input's change event,
      // and before the input's FileList has been populated,
      // so a delay is needed.
      window.setTimeout(() => {
        if (!input.files || !input.files.length) {
          resolve()
        }
      }, 1000)
    }

    // window "focus" event, fired even if the file picker is cancelled.
    window.addEventListener('focus', handleFocus)

    input.addEventListener('change', () => {
      if (input.files && input.files.length) {
        resolve(input.files[0])
      } else {
        resolve()
      }
    })

    input.click()
  })

export const importFile = async (file: File) => {
  const { name, lastModified } = file

  if (name.endsWith('.manuproj')) {
    const zip = await new JSZip().loadAsync(file)
    await removeUnsupportedData(zip)
    const blob = await zip.generateAsync({ type: 'blob' })
    file = new File([blob], name, { lastModified })
  }

  return importConvertedFile(file)
}
