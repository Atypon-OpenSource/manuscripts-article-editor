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

import { convertBibliographyItemToCSL, fixCSLData } from '@manuscripts/library'
import {
  Decoder,
  generateAttachmentFilename,
  getModelData,
  getModelsByType,
  HTMLTransformer,
  isFigure,
  isUserProfile,
  JATSExporter,
} from '@manuscripts/manuscript-transform'
import {
  BibliographyItem,
  Bundle,
  Citation,
  Model,
  ObjectTypes,
  Project,
} from '@manuscripts/manuscripts-json-schema'
// eslint-disable-next-line import/no-unresolved
import { Data } from 'csl-json'
import JSZip from 'jszip'

import { GetAttachment } from '../components/projects/Exporter'
import { JsonModel, ProjectDump } from './importers'
import { exportData } from './pressroom'

export const removeEmptyStyles = (model: { [key: string]: any }) => {
  Object.entries(model).forEach(([key, value]) => {
    if (value === '' && key.match(/Style$/)) {
      delete model[key]
    }
  })
}

export const createProjectDump = (
  modelMap: Map<string, Model>,
  manuscriptID?: string | null
): ProjectDump => ({
  version: '2.0',
  data: Array.from(modelMap.values())
    .filter((model: Model) => {
      if (!manuscriptID) {
        return true
      }
      return (
        model.objectType !== ObjectTypes.Manuscript ||
        model._id === manuscriptID
      )
    })
    .map((data) => {
      const { ...model } = data

      removeEmptyStyles(model)

      return model as JsonModel
    }),
})

const modelHasObjectType = <T extends Model>(
  model: Model,
  objectType: string
): model is T => {
  return model.objectType === objectType
}

const fetchAttachment = async (
  getAttachment: GetAttachment,
  model: Model
): Promise<Blob | undefined> => {
  if (isUserProfile(model) && model.avatar) {
    return getAttachment(model._id, 'image')
  }

  if (isFigure(model)) {
    return getAttachment(model._id, 'image')
  }

  if (modelHasObjectType<Bundle>(model, ObjectTypes.Bundle)) {
    return getAttachment(model._id, 'csl')
  }

  return undefined
}

const buildAttachments = async (
  getAttachment: GetAttachment,
  modelMap: Map<string, Model>
): Promise<Map<string, Blob>> => {
  const attachments: Map<string, Blob> = new Map()

  for (const [id, model] of modelMap.entries()) {
    try {
      const attachment = await fetchAttachment(getAttachment, model)

      if (attachment) {
        attachments.set(id, attachment)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return attachments
}

export const buildProjectBundle = async (
  getAttachment: GetAttachment,
  modelMap: Map<string, Model>,
  manuscriptID: string | null,
  format: ExportFormat
): Promise<JSZip> => {
  const attachments = await buildAttachments(getAttachment, modelMap)

  const data = createProjectDump(modelMap, manuscriptID)

  const zip = new JSZip()

  zip.file<'string'>('index.manuscript-json', JSON.stringify(data, null, 2))

  for (const model of modelMap.values()) {
    const attachment = attachments.get(model._id)

    if (attachment) {
      switch (format) {
        case 'html':
        case 'jats': {
          // add file extension for JATS/HTML export
          const filename = generateAttachmentFilename(
            model._id,
            attachment.type
          )
          // TODO: change folder name?
          zip.file<'blob'>('Data/' + filename, attachment)
          break
        }

        default: {
          const filename = generateAttachmentFilename(model._id)
          zip.file<'blob'>('Data/' + filename, attachment)
          break
        }
      }
    }
  }

  return zip
}

export const generateDownloadFilename = (title: string) =>
  title
    .replace(/<[^>]*>/g, '') // remove markup
    .replace(/\W/g, '_') // remove non-word characters
    .replace(/_+(.)/g, (match, letter) => letter.toUpperCase()) // convert snake case to camel case
    .replace(/_+$/, '') // remove any trailing underscores
    .substring(0, 200)

export type ExportManuscriptFormat = 'pdf' | 'html' | 'jats' | 'manuproj'

export type ImportManuscriptFormat = 'xml' | 'pdf' | 'word' | 'word-arc' | 'zip'

export type ExportBibliographyFormat = 'bibtex' | 'ris'

export type ExportFormat = ExportManuscriptFormat | ExportBibliographyFormat

export const downloadExtension = (format: ExportFormat): string => {
  switch (format) {
    case 'pdf':
    case 'manuproj':
    case 'bibtex':
    case 'ris':
      return `.${format}`

    default:
      return '.zip'
  }
}

const convertToHTML = async (
  zip: JSZip,
  modelMap: Map<string, Model>,
  manuscriptID: string
) => {
  zip.remove('index.manuscript-json')

  const decoder = new Decoder(modelMap)
  const doc = decoder.createArticleNode(manuscriptID)

  const transformer = new HTMLTransformer()

  const html = await transformer.serializeToHTML(doc.content, modelMap)
  zip.file('index.html', html)

  return zip.generateAsync({ type: 'blob' })
}

const convertToJATS = async (
  zip: JSZip,
  modelMap: Map<string, Model>,
  manuscriptID: string
) => {
  zip.remove('index.manuscript-json')

  const decoder = new Decoder(modelMap)
  const doc = decoder.createArticleNode(manuscriptID)

  const transformer = new JATSExporter()

  const xml = await transformer.serializeToJATS(
    doc.content,
    modelMap,
    manuscriptID
  )
  zip.file('manuscript.xml', xml)

  return zip.generateAsync({ type: 'blob' })
}

const addContainersFile = async (zip: JSZip, project: Project) => {
  const container = getModelData(project)

  zip.file<'string'>('containers.json', JSON.stringify([container]))
}

const prepareBibliography = (modelMap: Map<string, Model>): Data[] => {
  const citations = getModelsByType<Citation>(modelMap, ObjectTypes.Citation)

  const items: BibliographyItem[] = []

  for (const citation of citations) {
    for (const citationItem of citation.embeddedCitationItems) {
      if (citationItem.bibliographyItem) {
        const item = modelMap.get(citationItem.bibliographyItem)

        if (item) {
          items.push(item as BibliographyItem)
        }
      }
    }
  }

  return items.map(convertBibliographyItemToCSL).map(fixCSLData)
}

export const exportProject = async (
  getAttachment: GetAttachment,
  modelMap: Map<string, Model>,
  manuscriptID: string | null,
  format: ExportFormat,
  project?: Project
): Promise<Blob> => {
  const zip = await buildProjectBundle(
    getAttachment,
    modelMap,
    manuscriptID,
    format
  )

  switch (format) {
    // export bibliography
    case 'bibtex':
    case 'ris': {
      const data = prepareBibliography(modelMap)

      const form = new FormData()

      const json = JSON.stringify(data, null, 2)
      form.append('file', new Blob([json]))
      form.append('format', format)

      return exportData(form, 'bibliography')
    }

    // export Manuscripts archive
    case 'manuproj':
      if (project) {
        await addContainersFile(zip, project)
      }

      // TODO: remove invitations and annotations?

      return zip.generateAsync({ type: 'blob' })

    // export from ProseMirror
    case 'jats':
      if (!manuscriptID) {
        throw new Error('No manuscript selected')
      }

      return convertToJATS(zip, modelMap, manuscriptID)

    case 'html':
      if (!manuscriptID) {
        throw new Error('No manuscript selected')
      }

      return convertToHTML(zip, modelMap, manuscriptID)

    // export via Pressroom
    default: {
      if (!manuscriptID) {
        throw new Error('No manuscript selected')
      }

      const file = await zip.generateAsync({ type: 'blob' })

      const form = new FormData()
      form.append('file', file, 'export.manuproj')
      form.append('manuscriptID', manuscriptID)

      return exportData(form, format)
    }
  }
}
