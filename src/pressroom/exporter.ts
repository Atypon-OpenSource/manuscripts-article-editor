/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Attachments,
  Decoder,
  ModelAttachment,
  serializeToJATS,
  UserProfileWithAvatar,
} from '@manuscripts/manuscript-transform'
import {
  Figure,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import JSZip from 'jszip'
import { JsonModel, ProjectDump } from './importers'
import { convert } from './pressroom'

// tslint:disable-next-line:no-any
export const removeEmptyStyles = (model: { [key: string]: any }) => {
  Object.entries(model).forEach(([key, value]) => {
    if (value === '' && key.match(/Style$/)) {
      delete model[key]
    }
  })
}

const createProjectDump = (
  modelMap: Map<string, Model>,
  manuscriptID: string
): ProjectDump => ({
  version: '2.0',
  data: Array.from(modelMap.values())
    .filter((model: Model) => {
      return (
        model.objectType !== ObjectTypes.Manuscript ||
        model._id === manuscriptID
      )
    })
    .map(data => {
      const { _attachments, attachment, src, ...model } = data as Model &
        ModelAttachment &
        Attachments

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

const fetchBlob = (url: string) => fetch(url).then(res => res.blob())

const fetchAttachment = (
  model: Model & ModelAttachment
): Promise<Blob> | null => {
  if (
    modelHasObjectType<UserProfileWithAvatar>(model, ObjectTypes.UserProfile) &&
    model.avatar
  ) {
    return fetchBlob(model.avatar)
  }

  if (modelHasObjectType<Figure>(model, ObjectTypes.Figure) && model.src) {
    return fetchBlob(model.src)
  }

  return null
}

export const generateAttachmentFilename = (id: string) => id.replace(':', '_')

const buildAttachments = (modelMap: Map<string, Model>) => {
  const attachments: Map<string, Promise<Blob>> = new Map()

  for (const [id, model] of modelMap.entries()) {
    const attachment = fetchAttachment(model)

    if (attachment) {
      attachments.set(id, attachment)
    }
  }

  return attachments
}

const buildProjectBundle = (
  modelMap: Map<string, Model>,
  manuscriptID: string
): JSZip => {
  const attachments = buildAttachments(modelMap)

  const data = createProjectDump(modelMap, manuscriptID)

  const zip = new JSZip()

  zip.file<'string'>('index.manuscript-json', JSON.stringify(data))

  for (const model of modelMap.values()) {
    const attachment = attachments.get(model._id)

    if (attachment) {
      const filename = generateAttachmentFilename((model as JsonModel)._id)
      zip.file<'blob'>('Data/' + filename, attachment)
    }
  }

  return zip
}

export const generateDownloadFilename = (title: string) =>
  title
    .replace(/<[^>]*>/g, '') // remove markup
    .replace(/\W/g, '_') // remove non-word characters
    .replace(/_+(.)/g, matches => matches[1].toUpperCase()) // convert snake case to camel case
    .replace(/_+$/, '') // remove any trailing underscores

export const downloadExtension = (format: string): string => {
  switch (format) {
    case '.docx':
    case '.pdf':
      return format

    default:
      return '.zip'
  }
}

const convertToXML = async (zip: JSZip, modelMap: Map<string, Model>) => {
  zip.remove('index.manuscript-json')

  const decoder = new Decoder(modelMap)
  const doc = decoder.createArticleNode()

  zip.file('manuscript.xml', serializeToJATS(doc.content, modelMap))

  return zip.generateAsync({ type: 'blob' })
}

export const exportProject = async (
  modelMap: Map<string, Model>,
  manuscriptID: string,
  format: string
): Promise<Blob> => {
  const zip = buildProjectBundle(modelMap, manuscriptID)

  switch (format) {
    case '.xml':
      return convertToXML(zip, modelMap)

    case '.manuproj':
      return zip.generateAsync({ type: 'blob' })

    default:
      const file = await zip.generateAsync({ type: 'blob' })

      const form = new FormData()
      form.append('file', file, 'export.manuproj')

      return convert(form, format)
  }
}
