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

import { DEFAULT_BUNDLE } from '@manuscripts/manuscript-transform'
import {
  Bundle,
  ManuscriptCategory,
  Model,
  ObjectTypes,
} from '@manuscripts/manuscripts-json-schema'
import { orderBy } from 'lodash-es'
import {
  ManuscriptTemplate,
  Publisher,
  ResearchField,
  SectionCategory,
  TemplatesDataType,
} from '../../types/templates'
import { bundles } from '../__fixtures__/bundles'
import { manuscriptCategories } from '../__fixtures__/manuscript-categories'
import { publishers } from '../__fixtures__/publishers'
import { researchFields } from '../__fixtures__/research-fields'
import { sectionCategories } from '../__fixtures__/section-categories'
import { templates } from '../__fixtures__/templates'
import {
  buildArticleType,
  buildCategories,
  buildItems,
  buildJournalTitle,
  buildManuscriptTitle,
  buildResearchFields,
  buildSectionFromDescription,
  categoriseSectionRequirements,
  chooseBundleID,
  chooseSectionTitle,
  createEmptyParagraph,
  createManuscriptSectionsFromTemplate,
  createMergedTemplate,
  fromPrototype,
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
  bundlesMap.get('MPBundle:www-zotero-org-styles-nonlinear-dynamics') as Bundle

describe('templates', () => {
  test('find bundle', () => {
    const template = exampleTemplate()

    expect(chooseBundleID(template)).toBe(
      'MPBundle:www-zotero-org-styles-nonlinear-dynamics'
    )

    delete template.bundle

    expect(chooseBundleID(template)).toBe(DEFAULT_BUNDLE)
  })

  test('build manuscript title', () => {
    const template = exampleTemplate()

    const result = buildManuscriptTitle({
      template,
      title: 'Foo',
    })

    expect(result).toBe('Untitled Foo Journal Article')
  })

  test('build article type', () => {
    const template = exampleTemplate()

    expect(buildArticleType(template)).toBe('Nonlinear Dynamics')
  })

  test('build journal title', () => {
    const template = exampleTemplate()
    const bundle = exampleBundle()

    expect(buildJournalTitle(template)).toBe('Nonlinear Dynamics')
    expect(buildJournalTitle(template, bundle)).toBe('Nonlinear Dynamics')
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

  test('categorise section requirements', async () => {
    const template = exampleTemplate()

    const requirements = prepareRequirements(template, templatesMap)

    expect(requirements).toHaveLength(5)

    const {
      requiredSections,
      manuscriptSections,
    } = categoriseSectionRequirements(requirements)

    expect(manuscriptSections).toHaveLength(1)
    expect(requiredSections).toHaveLength(4)
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
    expect(result.dependencies[0].objectType).toBe(ObjectTypes.ParagraphElement)
    expect(result.dependencies[0].contents).toBe(
      '<p data-placeholder-text="A short summary of your work."></p>'
    )

    expect(result.section.elementIDs).toEqual([result.dependencies[0]._id])
    expect(result.section.objectType).toBe(ObjectTypes.Section)
    expect(result.section.path).toEqual([result.section._id])
    expect(result.section.priority).toBe(1)
    expect(result.section.title).toBe('Example')
  })

  test('create manuscript sections from template', async () => {
    const template = exampleTemplate()

    const requirements = prepareRequirements(template, templatesMap)

    expect(requirements).toHaveLength(5)

    const { requiredSections } = categoriseSectionRequirements(requirements)

    const items = createManuscriptSectionsFromTemplate(
      requiredSections,
      sectionCategoriesMap
    )

    expect(items).toHaveLength(8)
    expect(items[0].objectType).toBe(ObjectTypes.ParagraphElement)
    expect(items[1].objectType).toBe(ObjectTypes.Section)
    expect(items[2].objectType).toBe(ObjectTypes.ParagraphElement)
    expect(items[3].objectType).toBe(ObjectTypes.Section)
    expect(items[4].objectType).toBe(ObjectTypes.ParagraphElement)
    expect(items[5].objectType).toBe(ObjectTypes.Section)
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
    const result = createEmptyParagraph()

    expect(result.objectType).toBe(ObjectTypes.ParagraphElement)
  })

  test('build items', () => {
    const result = buildItems(manuscriptTemplatesMap, bundlesMap, publishersMap)

    expect(result).toHaveLength(2)
  })
})
