import JSZip from 'jszip'
import * as ObjectTypes from '../transformer/object-types'
import { Figure, Model, ModelAttachment, UserProfile } from '../types/models'
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
    .filter((model: JsonModel) => {
      return (
        model.objectType !== ObjectTypes.MANUSCRIPT ||
        model._id === manuscriptID
      )
    })
    .map((model: JsonModel) => {
      delete model._attachments
      delete model.attachment
      delete model.src

      removeEmptyStyles(model)

      return model
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
    modelHasObjectType<UserProfile>(model, ObjectTypes.USER_PROFILE) &&
    model.image
  ) {
    return fetchBlob(model.image)
  }

  if (modelHasObjectType<Figure>(model, ObjectTypes.FIGURE) && model.src) {
    return fetchBlob(model.src)
  }

  return null
}

export const generateAttachmentFilename = (id: string) => id.replace(':', '_')

const buildProjectBundle = (
  modelMap: Map<string, Model>,
  manuscriptID: string
) => {
  const data = createProjectDump(modelMap, manuscriptID)

  const zip = new JSZip()

  zip.file<'string'>('index.manuscript-json', JSON.stringify(data))

  for (const model of modelMap.values()) {
    const attachment = fetchAttachment(model)

    if (attachment) {
      const filename = generateAttachmentFilename((model as JsonModel)._id)
      zip.file<'blob'>('Data/' + filename, attachment)
    }
  }

  return zip.generateAsync({ type: 'blob' })
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

export const exportProject = async (
  modelMap: Map<string, Model>,
  manuscriptID: string,
  format: string
) => {
  const file = await buildProjectBundle(modelMap, manuscriptID)
  // download(file, 'manuscript.manuproj.zip')

  const form = new FormData()
  form.append('file', file, 'export.manuproj')

  return convert(form, format)
}
