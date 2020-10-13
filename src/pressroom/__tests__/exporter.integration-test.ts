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
  Build,
  buildBibliographicName,
  buildBibliographyItem,
  buildContributor,
  buildManuscript,
  buildProject,
  buildSection,
  ContainedModel,
  DEFAULT_BUNDLE,
  generateID,
  hasObjectType,
} from '@manuscripts/manuscript-transform'
import {
  BibliographyElement,
  BibliographyItem,
  Bundle,
  Citation,
  ContainerInvitation,
  Contributor,
  Equation,
  EquationElement,
  MandatorySubsectionsRequirement,
  Manuscript,
  ManuscriptTemplate,
  Model,
  ObjectTypes,
  PageLayout,
  ParagraphElement,
  ParagraphStyle,
  Section,
  SectionCategory,
  SectionDescription,
  Style,
  Table,
  TableElement,
  TableStyle,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
// import data from '@manuscripts/examples/data/project-dump.json'
import { AxiosResponse, ResponseType } from 'axios'
// import { ProjectDump } from '../importers'
// import { buildModelMap } from './util'
// eslint-disable-next-line import/no-unresolved
import { Data } from 'csl-json'

import { importSharedData } from '../../lib/shared-data'
import {
  createEmptyParagraph,
  createManuscriptSectionsFromTemplate,
  createMergedTemplate,
  createNewBundledStyles,
  updatedPageLayout,
} from '../../lib/templates'
import { Requirement, TemplatesDataType } from '../../types/templates'
import {
  ExportBibliographyFormat,
  ExportManuscriptFormat,
  exportProject,
} from '../exporter'
import { getAttachment } from './attachments'

jest.unmock('axios')
// jest.unmock('../pressroom')

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

    return axios
      .post<ArrayBuffer>('/v1/compile/document', formData.getBuffer(), {
        baseURL: config.pressroom.url,
        // responseType: 'stream' as ResponseType,
        responseType: 'arraybuffer' as ResponseType,
        headers: {
          'Pressroom-API-Key': config.pressroom.key,
          'Pressroom-Target-File-Extension': format.replace(/^\./, ''),
          'Pressroom-Regenerate-Project-Bundle-Model-Object-IDs': 1,
          ...formData.getHeaders(),
        },
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response.statusText)
          console.error(error.response.data.toString())
          throw error
        }
      })
  }),

  convertBibliography: jest.fn(
    async (data: Data[], format: ExportBibliographyFormat) => {
      const { default: config } = await import('../../config')
      const { default: axios } = await import('axios')

      return axios.post<Blob>('/v1/compile/bibliography', data, {
        baseURL: config.pressroom.url,
        responseType: 'blob' as ResponseType,
        headers: {
          'Pressroom-API-Key': config.pressroom.key,
          'Pressroom-Target-Bibliography-Format':
            format === 'mods' ? 'xml' : format,
        },
      })
    }
  ),
}))

const user: Build<UserProfile> = {
  objectType: ObjectTypes.UserProfile,
  _id: 'MPUserProfile:1',
  userID: 'User_test',
  bibliographicName: buildBibliographicName({
    given: 'Foo',
    family: 'Bar',
  }),
}

const isManuscriptTemplate = hasObjectType<ManuscriptTemplate>(
  ObjectTypes.ManuscriptTemplate
)

const project = buildProject(user.userID)

const buildManuscriptModelMap = async (
  manuscript: Build<Manuscript>,
  templateID?: string
) => {
  const bundles = await importSharedData<Bundle>('bundles')
  const styles = await importSharedData<Style>('styles')

  const modelMap = new Map<string, ContainedModel>()

  const addModel = <T extends Model>(model: Build<T>) =>
    modelMap.set(model._id, {
      ...model,
      manuscriptID: manuscript._id,
      containerID: project._id,
      createdAt: 0,
      updatedAt: 0,
      sessionID: 'test',
    })

  // add the bundle
  const bundle = bundles.get(DEFAULT_BUNDLE)
  if (!bundle) {
    throw new Error('Default bundle not found')
  }
  addModel<Bundle>(bundle)

  // add the shared styles
  const newStyles = createNewBundledStyles(styles)
  for (const style of newStyles.values()) {
    addModel<Style>(style)
  }

  // add the page layout
  const newPageLayout = updatedPageLayout(newStyles)
  addModel<PageLayout>(newPageLayout)

  // add the author contributor
  const contributor = buildContributor(
    user.bibliographicName,
    'author',
    0,
    user.userID
  )
  addModel<Contributor>(contributor)

  // add an empty paragraph
  const paragraph = createEmptyParagraph(newPageLayout)
  addModel<ParagraphElement>(paragraph)

  // add a section
  const section = {
    ...buildSection(),
    elementIDs: [paragraph._id],
  }
  addModel<Section>(section)

  // add requirements and sections from a template
  if (templateID) {
    const templatesData = await importSharedData<TemplatesDataType>(
      'templates-v2'
    )

    const sectionCategories = await importSharedData<SectionCategory>(
      'section-categories'
    )

    const manuscriptTemplates = new Map<string, ManuscriptTemplate>()

    for (const item of templatesData.values()) {
      if (isManuscriptTemplate(item)) {
        manuscriptTemplates.set(item._id, item)
      }
    }

    const template = manuscriptTemplates.get(templateID)

    if (!template) {
      throw new Error('Manuscript template not found')
    }

    const mergedTemplate = createMergedTemplate(template, manuscriptTemplates)

    if (mergedTemplate.mandatorySectionRequirements) {
      for (const requirementID of mergedTemplate.mandatorySectionRequirements) {
        const requirement = templatesData.get(requirementID)

        if (requirement) {
          addModel<Requirement>(requirement as Requirement)
        }
      }
    }

    const sectionDescriptions: SectionDescription[] = []

    if (template.mandatorySectionRequirements) {
      for (const requirementID of template.mandatorySectionRequirements) {
        const requirement = templatesData.get(requirementID) as
          | MandatorySubsectionsRequirement
          | undefined

        if (requirement) {
          for (const sectionDescription of requirement.embeddedSectionDescriptions) {
            sectionDescriptions.push(sectionDescription)
          }
        }
      }
    }

    if (sectionDescriptions.length) {
      // create the required sections, if there are any
      const items = createManuscriptSectionsFromTemplate(
        templatesData,
        sectionCategories,
        sectionDescriptions
      )

      for (const item of items) {
        addModel(item)
      }
    } else {
      // create an empty section, if there are no required sections
      const paragraph = createEmptyParagraph(newPageLayout)

      addModel<ParagraphElement>(paragraph)

      addModel<Section>({
        ...buildSection(),
        elementIDs: [paragraph._id],
      })
    }

    addModel<ManuscriptTemplate>(mergedTemplate)
  }

  // add the manuscript
  addModel<Manuscript>({
    ...manuscript,
    bundle: bundle._id,
    pageLayout: newPageLayout._id,
    priority: 1,
  })

  return modelMap
}

const formats: Array<{
  format: ExportManuscriptFormat
  contentType: string
}> = [
  {
    format: 'docx',
    contentType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    format: 'pdf',
    contentType: 'application/pdf',
  },
  {
    format: 'md',
    contentType: 'application/zip',
  },
  {
    format: 'tex',
    contentType: 'application/zip',
  },
  {
    format: 'icml',
    contentType: 'application/zip',
  },
]

const bibliographyFormats: Array<{
  format: ExportBibliographyFormat
  contentType: string
}> = [
  {
    format: 'bib',
    contentType: 'text/plain; charset=utf-8',
  },
  {
    format: 'ris',
    contentType: 'text/plain; charset=utf-8',
  },
  {
    format: 'mods',
    contentType: 'text/plain; charset=utf-8',
  },
]

describe('exporter', () => {
  test('exports empty manuscript', async () => {
    const manuscript = buildManuscript()
    const modelMap = await buildManuscriptModelMap(manuscript)

    for (const format of formats) {
      console.log(`Exporting empty manuscript to ${format.format}`)

      // @ts-ignore: mocked convert function returns the response, not the blob
      const response: AxiosResponse<ArrayBuffer> = await exportProject(
        getAttachment,
        modelMap,
        manuscript._id,
        format.format
      )
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.data).not.toBeUndefined()
      expect(response.headers['content-type']).toBe(format.contentType)
      // TODO: validate the output?
    }
  })

  test('exports templated manuscript', async () => {
    const manuscript = buildManuscript()
    const templateID =
      'MPManuscriptTemplate:www-zotero-org-styles-plos-one-PLOS-ONE-Journal-Publication'
    const modelMap = await buildManuscriptModelMap(manuscript, templateID)

    for (const format of formats) {
      console.log(`Exporting templated manuscript to ${format.format}`)

      // @ts-ignore: mocked convert function returns the response, not the blob
      const response: AxiosResponse<ArrayBuffer> = await exportProject(
        getAttachment,
        modelMap,
        manuscript._id,
        format.format
      )
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.data).not.toBeUndefined()
      expect(response.headers['content-type']).toBe(format.contentType)
      // TODO: validate the output?
    }
  })

  test('exports empty manuscript plus previously-known failures', async () => {
    const manuscript = buildManuscript()
    const modelMap = await buildManuscriptModelMap(manuscript)

    const addModel = <T extends Model>(model: Build<T>) => {
      modelMap.set(model._id, {
        ...model,
        manuscriptID: manuscript._id,
        containerID: project._id,
        createdAt: 0,
        updatedAt: 0,
        sessionID: 'test',
      })

      return model
    }

    const findByObjectType = <T extends ContainedModel>(
      objectType: ObjectTypes
    ): T[] => {
      const items: T[] = []

      for (const model of modelMap.values()) {
        if (model.objectType === objectType) {
          items.push(model as T)
        }
      }

      return items
    }

    // find the first section
    const [section] = findByObjectType<Section>(ObjectTypes.Section)

    if (!section) {
      throw new Error('Missing section')
    }

    if (!section.elementIDs) {
      section.elementIDs = []
    }

    // add a container invitation
    addModel<ContainerInvitation>({
      _id: generateID(ObjectTypes.ContainerInvitation),
      objectType: ObjectTypes.ContainerInvitation,
      role: 'Viewer',
      invitingUserID: user.userID,
      invitingUserProfile: user as UserProfile,
      invitedUserEmail: 'foo@example.com',
      invitedUserName: 'Foo Bar',
    })

    // // add a figure with no image attachment (src)
    // const figure = addModel<Figure>({
    //   _id: generateID(ObjectTypes.Figure),
    //   objectType: ObjectTypes.Figure,
    // })
    //
    // const figureElement = addModel<FigureElement>({
    //   _id: generateID(ObjectTypes.FigureElement),
    //   objectType: ObjectTypes.FigureElement,
    //   containedObjectIDs: [figure._id],
    //   elementType: 'figure',
    //   caption: 'Test',
    // })
    //
    // section.elementIDs.push(figureElement._id)

    // add an equation with empty TeXRepresentation
    const equation = addModel<Equation>({
      _id: generateID(ObjectTypes.Equation),
      objectType: ObjectTypes.Equation,
      TeXRepresentation: '',
      MathMLStringRepresentation: `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"></math>`,
      SVGStringRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" width="1.131ex" height="1.507ex" role="img" focusable="false" viewBox="0 -666 500 666" style="vertical-align: 0px;"></svg>`,
    })

    const equationElement = addModel<EquationElement>({
      _id: generateID(ObjectTypes.EquationElement),
      objectType: ObjectTypes.EquationElement,
      containedObjectID: equation._id,
      caption: 'Test',
      elementType: 'p',
    })

    section.elementIDs.push(equationElement._id)

    // add a paragraph containing a citation

    const paragraphElementID = generateID(ObjectTypes.ParagraphElement)
    const bibliographyItemID = generateID(ObjectTypes.BibliographyItem)
    const citationID = generateID(ObjectTypes.Citation)
    const bibliographyElementID = generateID(ObjectTypes.BibliographyElement)

    addModel<BibliographyElement>({
      _id: bibliographyElementID,
      objectType: ObjectTypes.BibliographyElement,
      elementType: 'div',
      contents: `<div xmlns="http://www.w3.org/1999/xhtml" class="csl-bib-body" id="${bibliographyElementID}"></div>`,
    })

    section.elementIDs.push(bibliographyElementID)

    addModel<BibliographyItem>({
      _id: bibliographyItemID,
      objectType: ObjectTypes.BibliographyItem,
      type: 'article-journal',
      title: 'Foo',
    })

    addModel<Citation>({
      _id: citationID,
      objectType: ObjectTypes.Citation,
      containingObject: paragraphElementID,
      embeddedCitationItems: [
        {
          _id: generateID(ObjectTypes.CitationItem),
          objectType: ObjectTypes.CitationItem,
          bibliographyItem: bibliographyItemID,
        },
      ],
    })

    const paragraphElement = addModel<ParagraphElement>({
      _id: paragraphElementID,
      objectType: ObjectTypes.ParagraphElement,
      elementType: 'p',
      contents: `<p xmlns="http://www.w3.org/1999/xhtml" id="${paragraphElementID}" class="MPElement">A paragraph containing a citation.<span class="citation" data-reference-id="${citationID}">1</span></p>`,
    })

    section.elementIDs.push(paragraphElement._id)

    // export to each format
    for (const format of formats) {
      console.log(`Exporting previously-failing manuscript to ${format.format}`)

      // @ts-ignore: mocked convert function returns the response, not the blob
      const response: AxiosResponse<ArrayBuffer> = await exportProject(
        getAttachment,
        modelMap,
        manuscript._id,
        format.format
      )
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.data).not.toBeUndefined()
      expect(response.headers['content-type']).toBe(format.contentType)
      // TODO: validate the output?

      console.log(`Exported previously-failing manuscript to ${format.format}`)
    }
  })

  test('exports a manuscript with content', async () => {
    const manuscript = buildManuscript()
    const modelMap = await buildManuscriptModelMap(manuscript)

    const addModel = <T extends Model>(model: Build<T>) => {
      modelMap.set(model._id, {
        ...model,
        manuscriptID: manuscript._id,
        containerID: project._id,
        createdAt: 0,
        updatedAt: 0,
        sessionID: 'test',
      })

      return model
    }

    const findByObjectType = <T extends ContainedModel>(
      objectType: ObjectTypes
    ): T[] => {
      const items: T[] = []

      for (const model of modelMap.values()) {
        if (model.objectType === objectType) {
          items.push(model as T)
        }
      }

      return items
    }

    // find the first section
    const [section] = findByObjectType<Section>(ObjectTypes.Section)

    if (!section) {
      throw new Error('Missing section')
    }

    if (!section.elementIDs) {
      section.elementIDs = []
    }

    // add a table
    const [tableStyle] = findByObjectType<TableStyle>(ObjectTypes.TableStyle)

    if (!tableStyle) {
      throw new Error('Missing table style')
    }

    const [paragraphStyle] = findByObjectType<ParagraphStyle>(
      ObjectTypes.ParagraphStyle
    )

    if (!paragraphStyle) {
      throw new Error('Missing paragraph style')
    }

    const tableID = generateID(ObjectTypes.Table)
    const tableStyleID = tableStyle._id.replace(':', '_')
    const paragraphStyleID = paragraphStyle._id.replace(':', '_')

    const table = addModel<Table>({
      _id: tableID,
      objectType: ObjectTypes.Table,
      contents: `<table id="${tableID}" class="MPElement ${tableStyleID} ${paragraphStyleID}" data-contained-object-id="${tableID}"><thead style="display: table-header-group;"><tr><th data-placeholder-text="Header 1" class="placeholder"></th><th data-placeholder-text="Header 2" class="placeholder"></th></tr></thead><tbody><tr><td data-placeholder-text="Data" class="placeholder"></td><td data-placeholder-text="Data" class="placeholder"></td></tr><tr><td data-placeholder-text="Data" class="placeholder"></td><td data-placeholder-text="Data" class="placeholder"></td></tr></tbody><tfoot><tr><td data-placeholder-text="Footer 1" class="placeholder"></td><td data-placeholder-text="Footer 2" class="placeholder"></td></tr></tfoot></table>`,
    })

    const tableElement = addModel<TableElement>({
      _id: generateID(ObjectTypes.TableElement),
      objectType: ObjectTypes.TableElement,
      containedObjectID: table._id,
      elementType: 'table',
      caption: 'Test',
      tableStyle: tableStyle._id,
      paragraphStyle: paragraphStyle._id,
    })

    section.elementIDs.push(tableElement._id)

    // add an equation
    const equation = addModel<Equation>({
      _id: generateID(ObjectTypes.Equation),
      objectType: ObjectTypes.Equation,
      TeXRepresentation: '1',
      MathMLStringRepresentation: `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">  <mn>1</mn></math>`,
      SVGStringRepresentation: `<svg xmlns="http://www.w3.org/2000/svg" width="1.131ex" height="1.507ex" role="img" focusable="false" viewBox="0 -666 500 666" style="vertical-align: 0px;"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mn"><path data-c="31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"/></g></g></g></svg>`,
    })

    const equationElement = addModel<EquationElement>({
      _id: generateID(ObjectTypes.EquationElement),
      objectType: ObjectTypes.EquationElement,
      containedObjectID: equation._id,
      caption: 'Test',
      elementType: 'p',
    })

    section.elementIDs.push(equationElement._id)

    // export to each format
    for (const format of formats) {
      console.log(`Exporting manuscript with content to ${format.format}`)

      // @ts-ignore: mocked convert function returns the response, not the blob
      const response: AxiosResponse<ArrayBuffer> = await exportProject(
        getAttachment,
        modelMap,
        manuscript._id,
        format.format
      )
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.data).not.toBeUndefined()
      expect(response.headers['content-type']).toBe(format.contentType)
      // TODO: validate the output?
    }
  })

  test('exports bibliography', async () => {
    const modelMap = new Map<string, Model>()

    const manuscript = buildManuscript()
    modelMap.set(manuscript._id, manuscript as Manuscript)

    const bibliographyItems = [
      buildBibliographyItem({
        title: 'Foo',
      }),
      buildBibliographyItem({
        title: 'Foo',
        ISSN: ['1234-5678'],
      }),
      buildBibliographyItem({
        title: 'Foo',
        ISSN: '1234-5678',
        issue: 123,
      }),
    ]

    for (const bibliographyItem of bibliographyItems) {
      modelMap.set(bibliographyItem._id, bibliographyItem as BibliographyItem)
    }

    for (const format of bibliographyFormats) {
      console.log(`Exporting bibliography to ${format.format}`)

      // @ts-ignore: mocked convert function returns the response, not the blob
      const response: AxiosResponse<ArrayBuffer> = await exportProject(
        getAttachment,
        modelMap,
        manuscript._id,
        format.format
      )

      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.data).not.toBeUndefined()
      expect(response.headers['content-type']).toBe(format.contentType)
      // TODO: validate the output?
    }
  })
})
