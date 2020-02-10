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

import bundles from '@manuscripts/data/dist/shared/bundles.json'
import keywords from '@manuscripts/data/dist/shared/keywords.json'
import manuscriptCategories from '@manuscripts/data/dist/shared/manuscript-categories.json'
import publishers from '@manuscripts/data/dist/shared/publishers.json'
import sectionCategories from '@manuscripts/data/dist/shared/section-categories.json'
import templates from '@manuscripts/data/dist/shared/templates-v2.json'
import { DEFAULT_BUNDLE, generateID } from '@manuscripts/manuscript-transform'
import {
  Bundle,
  ManuscriptCategory,
  Model,
  ObjectTypes,
  PageLayout,
  ParagraphElement,
} from '@manuscripts/manuscripts-json-schema'
import { orderBy } from 'lodash-es'
import {
  ManuscriptTemplate,
  Publisher,
  ResearchField,
  SectionCategory,
  SectionDescription,
  TemplateData,
  TemplatesDataType,
} from '../../types/templates'
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
  isCoverLetter,
  isMandatorySubsectionsRequirement,
  prepareRequirements,
} from '../templates'

const buildMap = <T extends Model>(items: T[]): Map<string, T> => {
  const output = new Map()

  for (const item of items) {
    output.set(item._id, item)
  }

  return output
}

const templatesMap = buildMap<TemplatesDataType>(templates)

const bundlesMap = buildMap<Bundle>(bundles)

const manuscriptCategoriesMap = buildMap<ManuscriptCategory>(
  manuscriptCategories
)

const sectionCategoriesMap = buildMap<SectionCategory>(sectionCategories)

const researchFields = (keywords as ResearchField[]).filter(
  keyword => keyword.objectType === ObjectTypes.ResearchField
)

const researchFieldsMap = buildMap<ResearchField>(researchFields)

const publishersMap = buildMap<Publisher>(publishers)

const manuscriptTemplatesMap = new Map<string, ManuscriptTemplate>()

for (const item of templatesMap.values()) {
  if (item.objectType === 'MPManuscriptTemplate') {
    manuscriptTemplatesMap.set(item._id, item as ManuscriptTemplate)
  }
}

const exampleTemplate = () =>
  templatesMap.get(
    'MPManuscriptTemplate:www-zotero-org-styles-nonlinear-dynamics-Nonlinear-Dynamics-Journal-Publication'
  ) as ManuscriptTemplate

const exampleBundle = () =>
  bundlesMap.get(
    'MPBundle:www-zotero-org-styles-frontiers-in-computational-neuroscience'
  ) as Bundle

describe('templates', () => {
  test('find bundle id from template bundle', () => {
    const item: TemplateData = {
      title: 'Test',
      template: exampleTemplate(),
      bundle: exampleBundle(),
    }

    expect(chooseBundleID(item)).toBe(
      'MPBundle:www-zotero-org-styles-nonlinear-dynamics'
    )
  })

  test('find bundle id from bundle when no template', () => {
    const item: TemplateData = {
      title: 'Test',
      bundle: exampleBundle(),
    }

    expect(chooseBundleID(item)).toBe(
      'MPBundle:www-zotero-org-styles-frontiers-in-computational-neuroscience'
    )
  })

  test('use default bundle when no bundle', () => {
    const item: TemplateData = {
      title: 'Test',
    }

    expect(chooseBundleID(item)).toBe(DEFAULT_BUNDLE)
  })

  test('build article type', () => {
    const template = exampleTemplate()

    expect(buildArticleType(template)).toBe('Nonlinear Dynamics')
  })

  test('build journal title', () => {
    const template = exampleTemplate()
    const bundle = exampleBundle()

    expect(buildJournalTitle(template)).toBe('Nonlinear Dynamics')
    expect(buildJournalTitle(template, bundle)).toBe(
      'Frontiers in Computational Neuroscience'
    )
  })

  test('build categories', () => {
    expect(buildCategories(manuscriptCategoriesMap)).toEqual(
      orderBy(manuscriptCategories, 'priority', 'asc')
    )
  })

  test('build research fields', () => {
    expect(buildResearchFields(researchFieldsMap)).toEqual(
      orderBy(researchFields, 'priority', 'asc')
    )
  })

  test('choose section title from category', async () => {
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
      }
    )

    expect(result).toEqual('Abstract')
  })

  test('choose section title from description', async () => {
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
      }
    )

    expect(result).toEqual('Example')
  })

  test('build section from description', () => {
    const result = buildSectionFromDescription(
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
      1,
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
      }
    )

    expect(result.dependencies).toHaveLength(9)

    const paragraphElement = result.dependencies[0] as ParagraphElement

    expect(paragraphElement.objectType).toBe(ObjectTypes.ParagraphElement)
    expect(paragraphElement.contents).toBe(
      `<p xmlns="http://www.w3.org/1999/xhtml" id="${paragraphElement._id}" class="MPElement" data-placeholder-text="A short summary of your work."></p>`
    )

    expect(result.section.elementIDs).toEqual([paragraphElement._id])
    expect(result.section.objectType).toBe(ObjectTypes.Section)
    expect(result.section.path).toEqual([result.section._id])
    expect(result.section.priority).toBe(1)
    expect(result.section.title).toBe('Example')
  })

  test('create manuscript sections from template', async () => {
    const template = exampleTemplate()

    const requirements = prepareRequirements(template, templatesMap)

    expect(requirements).toHaveLength(5)

    const mandatorySubsectionsRequirements = requirements.filter(
      isMandatorySubsectionsRequirement
    )

    const requiredSections: SectionDescription[] = mandatorySubsectionsRequirements.flatMap(
      requirement =>
        requirement.embeddedSectionDescriptions.filter(
          sectionDescription => !isCoverLetter(sectionDescription)
        )
    )

    const items = createManuscriptSectionsFromTemplate(
      requiredSections,
      sectionCategoriesMap
    )

    expect(items).toHaveLength(7)
    expect(items[0].objectType).toBe(ObjectTypes.ParagraphElement)
    expect(items[1].objectType).toBe(ObjectTypes.Section)
    expect(items[2].objectType).toBe(ObjectTypes.ParagraphElement)
    expect(items[3].objectType).toBe(ObjectTypes.Section)
    expect(items[4].objectType).toBe(ObjectTypes.ParagraphElement)
    expect(items[5].objectType).toBe(ObjectTypes.Section)
    expect(items[6].objectType).toBe(ObjectTypes.Section)
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
    const template: ManuscriptTemplate = {
      _id: 'MPManuscriptTemplate:foo',
      parent:
        'MPManuscriptTemplate:www-zotero-org-styles-nonlinear-dynamics-Nonlinear-Dynamics-Journal-Publication',
      objectType: 'MPManuscriptTemplate',
      title: 'Example template with parent',
      requirementIDs: ['MPSectionRequirement:1', 'MPSectionRequirement:2'],
      priority: 3,
      createdAt: 0,
      updatedAt: 0,
    }

    const { _id, requirements, styles, ...result } = createMergedTemplate(
      template,
      manuscriptTemplatesMap
    )

    expect(result).toEqual({
      LaTeXTemplateURL:
        'http://static.springer.com/sgw/documents/468198/application/zip/LaTeX.zip',
      aim:
        'Nonlinear Dynamics provides a forum for the rapid publication of original research in the developing field of nonlinear dynamics. The scope of the journal encompasses all nonlinear dynamic phenomena associated with mechanical, structural, civil, aeronautical, ocean, electrical and control systems. Review articles and original contributions based on analytical, computational, and experimental methods are solicited, dealing with such topics as perturbation and computational methods, symbolic manipulation, dynamic stability, local and global methods, bifurcations, chaos, deterministic and random vibrations, Lie groups, multibody dynamics, robotics, fluid-solid interactions, system modelling and identification, friction and damping models, signal analysis, measurement techniques.',
      bundle: 'MPBundle:www-zotero-org-styles-nonlinear-dynamics',
      category: 'MPManuscriptCategory:research-article',
      createdAt: 0,
      objectType: 'MPManuscriptTemplate',
      priority: 3,
      prototype: 'MPManuscriptTemplate:foo',
      publisher: 'MPPublisher:springer',
      requirementIDs: [
        'MPSectionRequirement:1',
        'MPSectionRequirement:2',
        'MPMandatorySubsectionsRequirement:5C105460-B50D-4616-8A12-ADC99EFF359E',
        'MPMandatorySubsectionsRequirement:AA78B79C-17AB-45C4-8E11-E21FAB3F8B86',
        'MPMandatorySubsectionsRequirement:75CC5A24-8D8E-41BA-9488-36B0A138C27A',
        'MPMandatorySubsectionsRequirement:4238F0B9-E8E8-4E7A-9B58-2B9657C9338F',
        'MPMandatorySubsectionsRequirement:44CAA244-C3E7-46FC-8407-7733D14925ED',
      ],
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

  test('build items', () => {
    const result = buildItems(manuscriptTemplatesMap, bundlesMap, publishersMap)

    expect(result.length).toBeGreaterThan(1000)
  })
})
