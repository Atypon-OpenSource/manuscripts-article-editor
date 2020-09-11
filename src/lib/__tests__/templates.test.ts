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

import { DEFAULT_BUNDLE, generateID } from '@manuscripts/manuscript-transform'
import {
  Bundle,
  MandatorySubsectionsRequirement,
  ManuscriptTemplate,
  Model,
  ObjectTypes,
  PageLayout,
  ParagraphElement,
  SectionDescription,
} from '@manuscripts/manuscripts-json-schema'
import { orderBy } from 'lodash-es'
import { SharedData } from '../../components/templates/TemplateSelector'
import { ManuscriptTemplateData, TemplateData } from '../../types/templates'
import { loadSharedData } from '../shared-data'
import {
  buildArticleType,
  buildCategories,
  buildItems,
  buildJournalTitle,
  buildResearchFields,
  buildSectionFromDescription,
  chooseBundleID,
  chooseSectionTitle,
  createEmptyParagraph,
  createManuscriptSectionsFromTemplate,
  createMergedTemplate,
  fromPrototype,
  // isMandatorySubsectionsRequirement,
} from '../templates'

const TEST_TEMPLATE =
  'MPManuscriptTemplate:MPManuscriptTemplate:MPBundle:www-zotero-org-styles-chemistry-central-journal-chemistry_central_journal_publication-MPBundle:www-zotero-org-styles-chemistry-central-journal-chemistry_central_commentarry'
const TEST_BUNDLE =
  'MPBundle:www-zotero-org-styles-frontiers-in-computational-neuroscience'

describe('templates', () => {
  let sharedData: SharedData
  let testTemplate: ManuscriptTemplate
  let testBundle: Bundle

  beforeAll(async () => {
    sharedData = await loadSharedData()

    testTemplate = sharedData.manuscriptTemplates.get(
      TEST_TEMPLATE
    ) as ManuscriptTemplate

    testBundle = sharedData.bundles.get(TEST_BUNDLE) as Bundle
  })

  test('find bundle id from template bundle', () => {
    const item: TemplateData = {
      title: 'Test',
      template: testTemplate,
      bundle: testBundle,
      titleAndType: 'Test',
    }

    expect(chooseBundleID(item)).toBe(
      'MPBundle:www-zotero-org-styles-frontiers-in-computational-neuroscience'
    )
  })

  test('find bundle id from bundle when no template', () => {
    const item: TemplateData = {
      title: 'Test',
      bundle: testBundle,
      titleAndType: 'Test',
    }

    expect(chooseBundleID(item)).toBe(
      'MPBundle:www-zotero-org-styles-frontiers-in-computational-neuroscience'
    )
  })

  test('use default bundle when no bundle', () => {
    const item: TemplateData = {
      title: 'Test',
      titleAndType: 'Test',
    }

    expect(chooseBundleID(item)).toBe(DEFAULT_BUNDLE)
  })

  test('build article type', () => {
    expect(buildArticleType(testTemplate)).toBe('Chemistry Central Commentary')
  })

  test('build journal title', () => {
    expect(buildJournalTitle(testTemplate)).toBe('Chemistry Central Commentary')
    expect(buildJournalTitle(testTemplate, undefined, testBundle)).toBe(
      'Chemistry Central Commentary'
    )
  })

  test('build categories', () => {
    expect(buildCategories(sharedData.manuscriptCategories)).toEqual(
      orderBy([...sharedData.manuscriptCategories.values()], 'priority', 'asc')
    )
  })

  test('build research fields', () => {
    expect(buildResearchFields(sharedData.researchFields)).toEqual(
      orderBy([...sharedData.researchFields.values()], 'priority', 'asc')
    )
  })

  test('choose section title from category', () => {
    const result = chooseSectionTitle(
      {
        _id: 'MPSectionDescription:BFAC45E0-2403-4997-A145-183188A83F78',
        maxWordCount: 250,
        minWordCount: 150,
        objectType: 'MPSectionDescription',
        required: true,
        sectionCategory: 'MPSectionCategory:abstract',
      },
      {
        _id: 'MPSectionCategory:abstract',
        name: 'Abstract',
        desc: 'A short summary of your work.',
        objectType: 'MPSectionCategory',
        titles: ['abstract', 'summary', 'lead-in'],
        bundled: true,
        priority: 100,
        createdAt: 0,
        updatedAt: 0,
        manuscriptID: 'MPManuscript:1',
        containerID: 'MPProject:1',
        sessionID: 'test',
      }
    )

    expect(result).toEqual('Abstract')
  })

  test('choose section title from description', () => {
    const result = chooseSectionTitle(
      {
        _id: 'MPSectionDescription:BFAC45E0-2403-4997-A145-183188A83F78',
        maxWordCount: 250,
        minWordCount: 150,
        objectType: 'MPSectionDescription',
        required: true,
        title: 'Example',
        sectionCategory: 'MPSectionCategory:abstract',
      },
      {
        _id: 'MPSectionCategory:abstract',
        name: 'Abstract',
        desc: 'A short summary of your work.',
        objectType: 'MPSectionCategory',
        titles: ['abstract', 'summary', 'lead-in'],
        bundled: true,
        priority: 100,
        createdAt: 0,
        updatedAt: 0,
        manuscriptID: 'MPManuscript:1',
        containerID: 'MPProject:1',
        sessionID: 'test',
      }
    )

    expect(result).toEqual('Example')
  })

  test('build section from description', () => {
    const result = buildSectionFromDescription(
      sharedData.templatesData,
      {
        _id: 'MPSectionDescription:BFAC45E0-2403-4997-A145-183188A83F78',
        maxWordCount: 250,
        minWordCount: 150,
        objectType: 'MPSectionDescription',
        required: true,
        title: 'Example',
        sectionCategory: 'MPSectionCategory:abstract',
        subsections: [
          {
            title: 'Background',
          },
          {
            title: 'Methods',
          },
          {
            title: 'Results',
          },
          {
            title: 'Conclusions',
          },
        ],
      },
      {
        _id: 'MPSectionCategory:abstract',
        name: 'Abstract',
        desc: 'A short summary of your work.',
        objectType: 'MPSectionCategory',
        titles: ['abstract', 'summary', 'lead-in'],
        bundled: true,
        priority: 100,
        createdAt: 0,
        updatedAt: 0,
        manuscriptID: 'MPManuscript:1',
        containerID: 'MPProject:1',
        sessionID: 'test',
      }
    )

    expect(result.dependencies).toHaveLength(11)

    const [firstElement] = result.dependencies

    expect(firstElement.objectType).toBe(ObjectTypes.ParagraphElement)
    expect((firstElement as ParagraphElement).contents).toBe(
      `<p xmlns="http://www.w3.org/1999/xhtml" id="${firstElement._id}" class="MPElement" data-placeholder-text="A short summary of your work."></p>`
    )

    expect(result.section.elementIDs).toEqual([firstElement._id])
    expect(result.section.objectType).toBe(ObjectTypes.Section)
    expect(result.section.path).toEqual([result.section._id])
    expect(result.section.priority).toBe(100)
    expect(result.section.title).toBe('Example')
  })

  test('create manuscript sections from template', () => {
    const sectionDescriptions: SectionDescription[] = []

    if (testTemplate.mandatorySectionRequirements) {
      for (const requirementID of testTemplate.mandatorySectionRequirements) {
        const requirement = sharedData.templatesData.get(requirementID) as
          | MandatorySubsectionsRequirement
          | undefined

        if (requirement) {
          for (const sectionDescription of requirement.embeddedSectionDescriptions) {
            sectionDescriptions.push(sectionDescription)
          }
        }
      }
    }

    const items = createManuscriptSectionsFromTemplate(
      sharedData.templatesData,
      sharedData.sectionCategories,
      sectionDescriptions
    )

    expect(items).toHaveLength(11)

    const objectTypes = items.map(item => item.objectType)

    expect(objectTypes).toStrictEqual([
      ObjectTypes.ParagraphElement,
      ObjectTypes.Section,
      ObjectTypes.ParagraphElement,
      ObjectTypes.Section,
      ObjectTypes.Section,
      ObjectTypes.ParagraphElement,
      ObjectTypes.Section,
      ObjectTypes.ParagraphElement,
      ObjectTypes.Section,
      ObjectTypes.ParagraphElement,
      ObjectTypes.Section,
    ])
  })

  test('create model from prototype', () => {
    const model: Model = {
      _id: 'foo',
      objectType: ObjectTypes.Project,
      createdAt: 0,
      updatedAt: 0,
    }

    const result = fromPrototype(model)

    expect(result._id).not.toBe(model._id)

    // tslint:disable-next-line:no-any (add prototype to Model schema)
    expect((result as any).prototype).toBe(model._id)
  })

  test('create merged template', () => {
    const template: ManuscriptTemplateData = {
      _id: 'MPManuscriptTemplate:foo',
      parent:
        'MPManuscriptTemplate:www-zotero-org-styles-nonlinear-dynamics-Nonlinear-Dynamics-Journal-Publication',
      objectType: 'MPManuscriptTemplate',
      title: 'Example template with parent',
      mandatorySectionRequirements: [
        'MPMandatorySubsectionsRequirement:1',
        'MPMandatorySubsectionsRequirement:2',
      ],
      priority: 3,
      createdAt: 0,
      updatedAt: 0,
    }

    const { _id, requirements, styles, ...result } = createMergedTemplate(
      template,
      sharedData.manuscriptTemplates
    )

    expect(result).toEqual({
      LaTeXTemplateURL:
        'http://static.springer.com/sgw/documents/468198/application/zip/LaTeX.zip',
      aim:
        'Nonlinear Dynamics provides a forum for the rapid publication of original research in the developing field of nonlinear dynamics. The scope of the journal encompasses all nonlinear dynamic phenomena associated with mechanical, structural, civil, aeronautical, ocean, electrical and control systems. Review articles and original contributions based on analytical, computational, and experimental methods are solicited, dealing with such topics as perturbation and computational methods, symbolic manipulation, dynamic stability, local and global methods, bifurcations, chaos, deterministic and random vibrations, Lie groups, multibody dynamics, robotics, fluid-solid interactions, system modelling and identification, friction and damping models, signal analysis, measurement techniques.',
      bundle: 'MPBundle:www-zotero-org-styles-nonlinear-dynamics',
      category: 'MPManuscriptCategory:research-article',
      createdAt: 0,
      mandatorySectionRequirements: [
        'MPMandatorySubsectionsRequirement:1',
        'MPMandatorySubsectionsRequirement:2',
        'MPMandatorySubsectionsRequirement:5C105460-B50D-4616-8A12-ADC99EFF359E',
        'MPMandatorySubsectionsRequirement:AA78B79C-17AB-45C4-8E11-E21FAB3F8B86',
        'MPMandatorySubsectionsRequirement:75CC5A24-8D8E-41BA-9488-36B0A138C27A',
        'MPMandatorySubsectionsRequirement:4238F0B9-E8E8-4E7A-9B58-2B9657C9338F',
        'MPMandatorySubsectionsRequirement:44CAA244-C3E7-46FC-8407-7733D14925ED',
      ],
      objectType: 'MPManuscriptTemplate',
      priority: 3,
      prototype: 'MPManuscriptTemplate:foo',
      publisher: 'MPPublisher:springer',
      title: 'Example template with parent',
      updatedAt: 0,
    })
  })

  test('create empty paragraph', () => {
    const pageLayout: PageLayout = {
      _id: generateID(ObjectTypes.PageLayout),
      objectType: ObjectTypes.PageLayout,
      defaultParagraphStyle: generateID(ObjectTypes.ParagraphStyle),
      manuscriptID: generateID(ObjectTypes.Manuscript),
      containerID: generateID(ObjectTypes.Project),
      sessionID: 'test',
      createdAt: 0,
      updatedAt: 0,
      priority: 0,
      mirrorPagesHorizontally: false,
      beginChaptersOnRightHandPages: false,
      topMargin: 0,
      rightMargin: 0,
      bottomMargin: 0,
      leftMargin: 0,
      displayUnits: 'pt',
      pageSize: 'a4',
    }

    const result = createEmptyParagraph(pageLayout)

    expect(result.objectType).toBe(ObjectTypes.ParagraphElement)
  })

  test('build items', async () => {
    const result = buildItems(sharedData)

    expect(result.length).toBeGreaterThan(1000)
  })
})
