import {
  Attachments,
  ManuscriptModel,
  ModelAttachment,
} from '@manuscripts/manuscript-editor'
import {
  Figure,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import JSZip from 'jszip'
import { extname } from 'path'
import { cleanItem } from './clean-item'
import { generateAttachmentFilename } from './exporter'
import { convert } from './pressroom'

type Importer = (file: File) => Promise<Model[]>

interface Importers {
  [key: string]: Importer
}

export interface JsonModel
  extends ManuscriptModel,
    Attachments,
    ModelAttachment {
  _id: string
  bundled: boolean
  collection: string
  contentType: string
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
      .map(async item => {
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

const importConvertedFile: Importer = async (file: File) => {
  const form = new FormData()
  form.append('file', file)

  const result = await convert(form, '.manuproj')

  // download(result, 'manuscript.zip')

  return importProjectBundle(result)
}

const importers: Importers = {
  '.docx': importConvertedFile,
  '.html': importConvertedFile,
  '.md': importConvertedFile,
  '.manuproj': importProjectBundle,
  '.tex': importConvertedFile,
  '.zip': importConvertedFile,
}

export const openFilePicker = (): Promise<File> =>
  new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = Object.keys(importers).join(',')
    input.addEventListener('change', () => {
      if (input.files && input.files.length) {
        resolve(input.files[0])
      } else {
        reject(new Error('No file was received'))
      }
    })
    input.click()
  })

export const importFile = async (file: File) => {
  const extension = extname(file.name)

  return importers[extension](file)
}
