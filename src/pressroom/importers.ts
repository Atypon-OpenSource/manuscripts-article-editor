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
import {
  Bundle,
  ContributorRole,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import JSZip from 'jszip'
import { flatMap } from 'lodash-es'
import { basename, extname } from 'path'
import { FileExtensionError } from '../lib/errors'
import {
  createNewContributorRoles,
  createNewStyles,
  fetchSharedData,
} from '../lib/templates'
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

export const readProjectDumpFromArchive = async (
  zip: JSZip
): Promise<ProjectDump> => {
  const json = await zip.file('index.manuscript-json').async('text')

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

const importProjectArchive = async (result: Blob) => {
  const zip = await new JSZip().loadAsync(result)

  const projectDump = await readProjectDumpFromArchive(zip)

  if (projectDump.version !== '2.0') {
    throw new Error(`Unsupported version: ${projectDump.version}`)
  }

  // TODO: validate?
  // TODO: ensure default data is added
  // TODO: add default bundle (which has no parent bundle)
  // TODO: ensure that pageLayout and bundle are set

  const items = projectDump.data
    .filter(item => !item.bundled)
    .filter(item => item.objectType !== 'MPContentSummary')
    .filter(item => item._id)
    .map(item => cleanItem(item))

  // load attachments from the Data folder

  for (const file of Object.values(zip.files)) {
    if (!file.dir && file.name.startsWith('Data/')) {
      const id = basename(file.name).replace('_', ':')

      const model = items.find(model => model._id === id)

      if (model) {
        const objectType = model.objectType as ObjectTypes

        if (objectType in attachmentKeys) {
          model.attachment = {
            id: attachmentKeys[objectType]!,
            type:
              model.contentType || defaultAttachmentContentTypes[objectType]!,
            data: await file.async('blob'),
          }
        }
      }
    }
  }

  return items
}

interface BundledData {
  bundles: Map<string, Bundle>
  contributorRoles: Map<string, ContributorRole>
  styles: Map<string, Model>
}

export const importBundledData = async (): Promise<BundledData> => {
  const bundles = await fetchSharedData<Bundle>('bundles')
  const contributorRoles = await fetchSharedData<ContributorRole>(
    'contributor-roles'
  )
  const styles = await fetchSharedData<Model>('styles')

  return {
    bundles,
    contributorRoles: createNewContributorRoles(contributorRoles),
    styles: createNewStyles(styles),
  }
}

const convertFile = async (file: File): Promise<Blob> => {
  const form = new FormData()
  form.append('file', file)

  return convert(form, '.manuproj')
}

const parseXMLFile = async (file: File): Promise<Document> => {
  const url = window.URL.createObjectURL(file)
  const text = await fetch(url).then(response => response.text())
  return new DOMParser().parseFromString(text, 'application/xml')
}

const convertXMLDocument = (doc: Document): Model[] => {
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
  new Promise((resolve, reject) => {
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
        const [file] = input.files

        const extension = extname(file.name)

        if (acceptedExtensions.includes(extension)) {
          resolve(file)
        } else {
          const error = new FileExtensionError(extension, acceptedExtensions)
          reject(error)
        }
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

  // TODO: look inside .zip files
  if (name.endsWith('.xml')) {
    return parseXMLFile(file).then(convertXMLDocument)
  }

  const result = await convertFile(file)

  return importProjectArchive(result)
}
