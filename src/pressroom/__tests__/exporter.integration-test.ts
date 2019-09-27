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
  buildContributor,
  buildManuscript,
  buildProject,
  buildSection,
  ContainedModel,
  DEFAULT_BUNDLE,
  generateID,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  ContainerInvitation,
  Contributor,
  Figure,
  FigureElement,
  Manuscript,
  Model,
  ObjectTypes,
  PageLayout,
  ParagraphElement,
  Section,
  Style,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
// import data from '@manuscripts/examples/data/project-dump.json'
import { AxiosResponse, ResponseType } from 'axios'
import stream from 'stream'
import { ContributorRole } from '../../lib/roles'
import {
  createEmptyParagraph,
  createManuscriptSectionsFromTemplate,
  createMergedTemplate,
  createNewStyles,
  fetchSharedData,
  isCoverLetter,
  isMandatorySubsectionsRequirement,
  prepareRequirements,
  updatedPageLayout,
} from '../../lib/templates'
import {
  ManuscriptTemplate,
  RequirementType,
  SectionCategory,
  SectionDescription,
} from '../../types/templates'
import { exportProject } from '../exporter'
// import { ProjectDump } from '../importers'
// import { buildModelMap } from './util'

jest.unmock('axios')
jest.unmock('../pressroom')

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

    return axios.post<Blob>('/v1/document/compile', formData.getBuffer(), {
      baseURL: config.pressroom.url,
      responseType: 'stream' as ResponseType,
      headers: {
        'Pressroom-API-Key': config.pressroom.key,
        'Pressroom-Target-File-Extension': format.replace(/^\./, ''),
        'Pressroom-Regenerate-Project-Bundle-Model-Object-IDs': 1,
        ...formData.getHeaders(),
      },
    })
  }),
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

const project = buildProject(user.userID)

// tslint:disable-next-line:cyclomatic-complexity
const buildManuscriptModelMap = async (
  manuscript: Build<Manuscript>,
  templateID?: string
) => {
  const bundles = await fetchSharedData<Bundle>('bundles')
  const styles = await fetchSharedData<Style>('styles')

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
  const newStyles = createNewStyles(styles)
  for (const style of newStyles.values()) {
    addModel<Style>(style)
  }

  // add the page layout
  const newPageLayout = updatedPageLayout(newStyles)
  addModel<PageLayout>(newPageLayout)

  // add the author contributor
  const contributor = buildContributor(
    user.bibliographicName,
    ContributorRole.author,
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
    const templates = await fetchSharedData<ManuscriptTemplate>('templates-v2')

    const sectionCategories = await fetchSharedData<SectionCategory>(
      'section-categories'
    )

    const manuscriptTemplates = new Map<string, ManuscriptTemplate>()

    for (const item of templates.values()) {
      if (item.objectType === 'MPManuscriptTemplate') {
        manuscriptTemplates.set(item._id, item)
      }
    }

    const template = manuscriptTemplates.get(templateID)
    if (!template) {
      throw new Error('Manuscript template not found')
    }

    const mergedTemplate = createMergedTemplate(template, manuscriptTemplates)

    const requirements = prepareRequirements(mergedTemplate, templates)

    mergedTemplate.requirementIDs = []
    for (const requirement of requirements) {
      requirement._id = generateID(requirement.objectType as ObjectTypes)
      addModel<RequirementType>(requirement)
      mergedTemplate.requirementIDs.push(requirement._id)
    }

    const mandatorySubsectionsRequirements = requirements.filter(
      isMandatorySubsectionsRequirement
    )

    const requiredSections: SectionDescription[] = mandatorySubsectionsRequirements.flatMap(
      requirement =>
        requirement.embeddedSectionDescriptions.filter(
          sectionDescription => !isCoverLetter(sectionDescription)
        )
    )

    if (requiredSections.length && sectionCategories) {
      // create the required sections, if there are any
      const items = createManuscriptSectionsFromTemplate(
        requiredSections,
        sectionCategories
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

const formats = [
  {
    extension: '.docx',
    contentType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    extension: '.pdf',
    contentType: 'application/pdf',
  },
  {
    extension: '.md',
    contentType: 'application/zip',
  },
  {
    extension: '.tex',
    contentType: 'application/zip',
  },
]

describe('exporter', () => {
  test('exports empty manuscript', async () => {
    const manuscript = buildManuscript()
    const modelMap = await buildManuscriptModelMap(manuscript)

    for (const format of formats) {
      // @ts-ignore: mocked convert function returns the response, not the blob
      const response: AxiosResponse<Blob> = await exportProject(
        modelMap,
        manuscript._id,
        format.extension
      )
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.data).toBeInstanceOf(stream.Readable)
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
      // @ts-ignore: mocked convert function returns the response, not the blob
      const response: AxiosResponse<Blob> = await exportProject(
        modelMap,
        manuscript._id,
        format.extension
      )
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.data).toBeInstanceOf(stream.Readable)
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

    // add a container invitation
    addModel<ContainerInvitation>({
      _id: generateID(ObjectTypes.ContainerInvitation),
      objectType: ObjectTypes.ContainerInvitation,
      role: 'viewer',
      invitingUserID: user.userID,
      invitingUserProfile: user as UserProfile,
      invitedUserEmail: 'foo@example.com',
      invitedUserName: 'Foo Bar',
    })

    // add a figure with no image attachment (src)
    const figure = addModel<Figure>({
      _id: generateID(ObjectTypes.Figure),
      objectType: ObjectTypes.Figure,
    })

    addModel<FigureElement>({
      _id: generateID(ObjectTypes.FigureElement),
      objectType: ObjectTypes.FigureElement,
      containedObjectIDs: [figure._id],
      elementType: 'figure',
      caption: 'Test',
    })

    for (const format of formats) {
      // @ts-ignore: mocked convert function returns the response, not the blob
      const response: AxiosResponse<Blob> = await exportProject(
        modelMap,
        manuscript._id,
        format.extension
      )
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.data).toBeInstanceOf(stream.Readable)
      expect(response.headers['content-type']).toBe(format.contentType)
      // TODO: validate the output?
    }
  })
})
