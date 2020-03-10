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
  convertBibliographyItemToData,
  convertToMathML,
} from '@manuscripts/manuscript-editor'
import {
  Attachments,
  Decoder,
  generateAttachmentFilename,
  getModelData,
  getModelsByType,
  hasObjectType,
  HTMLTransformer,
  isFigure,
  isUserProfile,
  JATSExporter,
  ManuscriptModel,
  ModelAttachment,
  STSExporter,
} from '@manuscripts/manuscript-transform'
import {
  BibliographyItem,
  Bundle,
  Citation,
  Equation,
  Figure,
  InlineMathFragment,
  Manuscript,
  Model,
  ObjectTypes,
  Project,
} from '@manuscripts/manuscripts-json-schema'
import JSZip from 'jszip'
import { GetAttachment } from '../components/projects/Exporter'
import { fixCSLData } from '../lib/csl'
import { JsonModel, ProjectDump } from './importers'
import { convert, convertBibliography } from './pressroom'

// tslint:disable-next-line:no-any
export const removeEmptyStyles = (model: { [key: string]: any }) => {
  Object.entries(model).forEach(([key, value]) => {
    if (value === '' && key.match(/Style$/)) {
      delete model[key]
    }
  })
}

const unsupportedObjectTypes: ObjectTypes[] = [
  ObjectTypes.ContainerInvitation,
  ObjectTypes.ProjectInvitation,
  ObjectTypes.Invitation,
  ObjectTypes.ManuscriptTemplate,
  ObjectTypes.CommentAnnotation,
  ObjectTypes.LibraryCollection,
  ObjectTypes.Keyword,
  ObjectTypes.ContributorRole,
  ObjectTypes.InlineStyle,
]

const figureHasAttachment = (model: Figure, zip: JSZip): boolean => {
  // NOTE: not using model.contentType for file extension
  const filename = generateAttachmentFilename(model._id)

  // tslint:disable-next-line
  return zip.file('Data/' + filename) !== null
}

const isEquation = hasObjectType<Equation>(ObjectTypes.Equation)
const isInlineMathFragment = hasObjectType<InlineMathFragment>(
  ObjectTypes.InlineMathFragment
)

// Convert TeX to MathML for Equation and InlineMathFragment
// tslint:disable-next-line:cyclomatic-complexity
export const augmentEquations = async (modelMap: Map<string, Model>) => {
  for (const model of modelMap.values()) {
    if (
      isEquation(model) &&
      model.TeXRepresentation &&
      !model.MathMLStringRepresentation
    ) {
      // block equation
      const mathml = convertToMathML(model.TeXRepresentation, true)

      if (mathml) {
        model.MathMLStringRepresentation = mathml
        modelMap.set(model._id, model)
      }
    }

    if (
      isInlineMathFragment(model) &&
      model.TeXRepresentation &&
      !model.MathMLRepresentation
    ) {
      // inline equation
      const mathml = convertToMathML(model.TeXRepresentation, false)

      if (mathml) {
        model.MathMLRepresentation = mathml
        modelMap.set(model._id, model)
      }
    }
  }
}

export const removeUnsupportedData = async (zip: JSZip) => {
  const path = 'index.manuscript-json'

  const json = await zip.file(path).async('text')
  const bundle = JSON.parse(json) as ProjectDump

  bundle.data = bundle.data.filter((model: ManuscriptModel) => {
    if (unsupportedObjectTypes.includes(model.objectType as ObjectTypes)) {
      return false
    }

    if (isFigure(model) && !figureHasAttachment(model, zip)) {
      return false
    }

    return true
  })

  bundle.data.forEach((model: ManuscriptModel & { listingID?: string }) => {
    delete model.containerID
    delete model.manuscriptID
    delete model.listingID // figures and tables
  })

  zip.file(path, JSON.stringify(bundle, null, 2))
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
      console.error(error) // tslint:disable-line:no-console
    }
  }

  return attachments
}

export const buildProjectBundle = async (
  getAttachment: GetAttachment,
  modelMap: Map<string, Model>,
  manuscriptID: string,
  format: ExportFormat
): Promise<JSZip> => {
  const attachments = await buildAttachments(getAttachment, modelMap)

  if (format === 'docx') {
    await augmentEquations(modelMap)
  }

  const data = createProjectDump(modelMap, manuscriptID)

  const zip = new JSZip()

  zip.file<'string'>('index.manuscript-json', JSON.stringify(data, null, 2))

  for (const model of modelMap.values()) {
    const attachment = attachments.get(model._id)

    if (attachment) {
      switch (format) {
        case 'html':
        case 'jats':
        case 'sts': {
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
    .substr(0, 200)

export type ExportManuscriptFormat =
  | 'docx'
  | 'pdf'
  | 'tex'
  | 'html'
  | 'icml'
  | 'md'
  | 'do'
  | 'jats'
  | 'sts'
  | 'manuproj'

export type ExportBibliographyFormat = 'bib' | 'ris' | 'mods'

export type ExportFormat = ExportManuscriptFormat | ExportBibliographyFormat

export const downloadExtension = (format: ExportFormat): string => {
  switch (format) {
    case 'docx':
    case 'pdf':
    case 'manuproj':
    case 'bib':
    case 'ris':
      return `.${format}`

    case 'mods':
      return '.xml'

    default:
      return '.zip'
  }
}

const convertToHTML = async (zip: JSZip, modelMap: Map<string, Model>) => {
  zip.remove('index.manuscript-json')

  const decoder = new Decoder(modelMap)
  const doc = decoder.createArticleNode()

  const transformer = new HTMLTransformer()

  zip.file('index.html', transformer.serializeToHTML(doc.content, modelMap))

  return zip.generateAsync({ type: 'blob' })
}

const convertToJATS = async (zip: JSZip, modelMap: Map<string, Model>) => {
  zip.remove('index.manuscript-json')

  const decoder = new Decoder(modelMap)
  const doc = decoder.createArticleNode()

  const transformer = new JATSExporter()

  zip.file('manuscript.xml', transformer.serializeToJATS(doc.content, modelMap))

  return zip.generateAsync({ type: 'blob' })
}

const convertToSTS = async (zip: JSZip, modelMap: Map<string, Model>) => {
  zip.remove('index.manuscript-json')

  const decoder = new Decoder(modelMap)
  const doc = decoder.createArticleNode()

  const transformer = new STSExporter()

  zip.file('manuscript.xml', transformer.serializeToSTS(doc.content, modelMap))

  return zip.generateAsync({ type: 'blob' })
}

const addContainersFile = async (zip: JSZip, project: Project) => {
  const container = getModelData(project)

  zip.file<'string'>('containers.json', JSON.stringify([container]))
}

const prepareBibliography = (modelMap: Map<string, Model>): CSL.Data[] => {
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

  return items
    .map(convertBibliographyItemToData)
    .map(item => fixCSLData(item as CSL.Data))
}

// tslint:disable:cyclomatic-complexity
export const exportProject = async (
  getAttachment: GetAttachment,
  modelMap: Map<string, Model>,
  manuscriptID: string,
  format: ExportFormat,
  project?: Project
): Promise<Blob> => {
  // if (project) {
  //   modelMap.set(project._id, project)
  // }

  const zip = await buildProjectBundle(
    getAttachment,
    modelMap,
    manuscriptID,
    format
  )

  switch (format) {
    case 'jats':
      return convertToJATS(zip, modelMap)

    case 'sts':
      return convertToSTS(zip, modelMap)

    case 'html':
      return convertToHTML(zip, modelMap)

    case 'manuproj':
      if (project) {
        await addContainersFile(zip, project)
      }

      return zip.generateAsync({ type: 'blob' })

    case 'bib':
    case 'mods':
    case 'ris': {
      const data = prepareBibliography(modelMap)

      return convertBibliography(data, format)
    }

    case 'do': {
      const { DOI } = modelMap.get(manuscriptID) as Manuscript

      if (!DOI) {
        window.alert('A DOI is required for Literatum export')
        throw new Error('A DOI is required for Literatum export')
      }

      const [, identifier] = DOI.split('/')

      const file = await zip.generateAsync({ type: 'blob' })

      const form = new FormData()
      form.append('file', file, 'export.manuproj')

      return convert(form, format, {
        'Pressroom-Target-Jats-Output-Format': 'literatum-do',
        'Pressroom-Jats-Document-Processing-Level': 'full_text',
        'Pressroom-Digital-Object-Type': 'magazine',
        'Pressroom-Jats-Submission-Doi': DOI,
        'Pressroom-Jats-Submission-Identifier': identifier,
      })
    }

    default: {
      // remove this once it's no longer needed:
      // https://gitlab.com/mpapp-private/manuscripts-frontend/issues/671
      await removeUnsupportedData(zip)

      const file = await zip.generateAsync({ type: 'blob' })

      // import('file-saver').then(({ saveAs }) => {
      //   saveAs(file, 'export.manuproj')
      // })

      const form = new FormData()
      form.append('file', file, 'export.manuproj')

      return convert(form, format)
    }
  }
}
