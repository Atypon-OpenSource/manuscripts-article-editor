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
  ModelAttachment,
  parseJATSArticle,
  parseSTSStandard,
} from '@manuscripts/manuscript-transform'
import { Model, ObjectTypes } from '@manuscripts/manuscripts-json-schema'
import JSZip from 'jszip'
import { flatMap } from 'lodash-es'
import pathParse from 'path-parse'

import config from '../config'
import { FileExtensionError } from '../lib/errors'
import { idRe } from '../lib/id'
import { updateAttachments, updateIdentifiers } from '../lib/update-identifiers'
import { ImportManuscriptFormat } from './exporter'
import { cleanItem } from './ImporterUtils'
import { importData } from './pressroom'

export interface JsonModel extends Model, ModelAttachment {
  bundled?: boolean
  collection?: string
  contentType?: string
}

export interface ProjectDump {
  version: string
  data: JsonModel[]
}

export const readProjectDumpFromArchive = async (
  zip: JSZip
): Promise<ProjectDump> => {
  const json = await zip.files['index.manuscript-json'].async('text')

  return JSON.parse(json)
}

const attachmentKeys: { [key in ObjectTypes]?: string } = {
  [ObjectTypes.Figure]: 'image',
  [ObjectTypes.Bundle]: 'csl',
}

const defaultAttachmentContentTypes: { [key in ObjectTypes]?: string } = {
  [ObjectTypes.Figure]: 'image/png',
  [ObjectTypes.Bundle]: 'application/vnd.citationstyles.style+xml',
}

// load attachments from the Data folder
const loadManuscriptsAttachments = async (zip: JSZip, models: JsonModel[]) => {
  for (const file of Object.values(zip.files)) {
    if (!file.dir && file.name.startsWith('Data/')) {
      const { base } = pathParse(file.name)
      const id = base.replace('_', ':')

      const model = models.find((model) => model._id === id)

      if (model) {
        const objectType = model.objectType as ObjectTypes

        if (objectType in attachmentKeys) {
          model.attachment = {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: attachmentKeys[objectType]!,
            type:
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              model.contentType || defaultAttachmentContentTypes[objectType]!,
            data: await file.async('blob'),
          }
        }
      }
    }
  }
}

export const importProjectArchive = async (
  blob: Blob,
  regenerateIDs = false
) => {
  const zip = await new JSZip().loadAsync(blob)

  const { data, version } = await readProjectDumpFromArchive(zip)

  if (version !== '2.0') {
    throw new Error(`Unsupported version: ${version}`)
  }

  if (regenerateIDs) {
    const idMap = await updateIdentifiers(data)

    await updateAttachments(zip, idMap)
  }

  // TODO: validate?
  // TODO: ensure default data is added
  // TODO: add default bundle (which has no parent bundle)
  // TODO: ensure that pageLayout and bundle are set

  const models = data
    .filter((item) => item.objectType !== 'MPContentSummary')
    .filter((item) => item._id && idRe.test(item._id))
    .map((item) => cleanItem(item))

  await loadManuscriptsAttachments(zip, models)

  return models
}

const parseXMLFile = async (blob: Blob): Promise<Document> => {
  const url = window.URL.createObjectURL(blob)
  const xml = await fetch(url).then((response) => response.text())
  return parseXML(xml)
}

const parseXML = (xml: string): Document => {
  return new DOMParser().parseFromString(xml, 'application/xml')
}

const convertXMLDocument = async (doc: Document): Promise<Model[]> => {
  // TODO: check doc.doctype.publicId?
  switch (doc.documentElement.nodeName) {
    case 'article':
      return parseJATSArticle(doc)

    case 'standard':
      return parseSTSStandard(doc)

    default:
      throw new Error('Unsupported XML format')
  }
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
    extension: '.xml',
    mimetypes: ['application/xml', 'text/xml'],
    description: 'JATS/STS XML',
  },
  {
    extension: '.zip',
    mimetypes: ['application/zip'],
    description: 'ZIP (containing Markdown or LaTeX)', // TODO: could also be XML or HTML
  },
]

export const acceptedFileExtensions = () => {
  return fileTypes.map((item) => item.extension)
}

export const acceptedFileDescription = () => {
  return fileTypes.map((item) => item.description)
}

export const acceptedMimeTypes = () => {
  return flatMap(fileTypes, (item) => item.mimetypes)
}

export const openFilePicker = (
  acceptedExtensions: string[] = acceptedFileExtensions(),
  multiple = false
): Promise<File[]> =>
  new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = acceptedExtensions.join(',')
    input.multiple = multiple

    const handleFocus = () => {
      window.removeEventListener('focus', handleFocus)

      // This event is fired before the input's change event,
      // and before the input's FileList has been populated,
      // so a delay is needed.
      window.setTimeout(() => {
        if (!input.files || !input.files.length) {
          resolve([])
        }
      }, 1000)
    }

    // window "focus" event, fired even if the file picker is cancelled.
    window.addEventListener('focus', handleFocus)

    input.addEventListener('change', () => {
      if (input.files && input.files.length) {
        for (const file of input.files) {
          const { ext } = pathParse(file.name)
          const extension = ext.toLowerCase()

          if (!acceptedExtensions.includes(extension)) {
            const error = new FileExtensionError(extension, acceptedExtensions)
            reject(error)
            return
          }
        }

        resolve(Array.from(input.files))
      } else {
        resolve([])
      }
    })

    input.click()
  })

export const putIntoZip = async (file: File) => {
  const zip = new JSZip()
  const text = await file.text()
  zip.file<'string'>(file.name, text)
  return zip.generateAsync({ type: 'blob' })
}

export const importFile = async (file: File) => {
  const extension = file.name.split('.').pop()

  if (!extension) {
    throw new Error('No file extension found')
  }
  // TODO: reject unsupported file extensions

  const form = new FormData()
  if (['md', 'jats', 'latex', 'tex', 'html'].includes(extension)) {
    const fileToUpload = await putIntoZip(file)
    form.append('file', fileToUpload)
    const result = await importData(form, 'zip', {})
    return importProjectArchive(result)
  }

  if (extension === 'xml') {
    return parseXMLFile(file).then(convertXMLDocument)
  }

  if (extension === 'manuproj') {
    return importProjectArchive(file, true)
  }

  form.append('file', file)

  const headers: Record<string, string> = {}

  let sourceFormat = extension as ImportManuscriptFormat

  if (extension === 'docx' || extension === 'doc') {
    form.append('enrichMetadata', 'true') // TODO: use this for all formats

    if (config.extyles.arc.secret) {
      sourceFormat = 'word-arc'
      headers['pressroom-extylesarc-secret'] = config.extyles.arc.secret
    } else {
      sourceFormat = 'word'
    }
  }

  // TODO: look inside .zip files

  const result = await importData(form, sourceFormat, headers)

  return importProjectArchive(result)
}
