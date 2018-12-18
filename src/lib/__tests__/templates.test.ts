import { DEFAULT_BUNDLE } from '@manuscripts/manuscript-editor'
import {
  Bundle,
  ManuscriptCategory,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import { orderBy } from 'lodash-es'
import {
  ManuscriptTemplate,
  ResearchField,
  TemplatesDataType,
} from '../../types/templates'
import { bundles } from '../__fixtures__/bundles'
import { manuscriptCategories } from '../__fixtures__/manuscript-categories'
import { researchFields } from '../__fixtures__/research-fields'
import { templates } from '../__fixtures__/templates'
import {
  buildArticleType,
  buildCategories,
  buildJournalTitle,
  buildManuscriptTitle,
  buildResearchFields,
  categoriseSectionRequirements,
  findBundle,
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

const researchFieldsMap = buildMap<ResearchField>(researchFields)

// const publishersMap = buildMap<Publisher>(publishers)

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

    expect(findBundle(template)).toBe(
      'MPBundle:www-zotero-org-styles-nonlinear-dynamics'
    )

    delete template.bundle

    expect(findBundle(template)).toBe(DEFAULT_BUNDLE)
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
})
