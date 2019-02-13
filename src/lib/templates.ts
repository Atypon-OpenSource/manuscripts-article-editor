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
  Build,
  buildParagraph,
  buildSection,
  DEFAULT_BUNDLE,
  generateID,
  ManuscriptModel,
  ObjectType,
} from '@manuscripts/manuscript-editor'
import {
  Bundle,
  ManuscriptCategory,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import axios from 'axios'
import { mergeWith } from 'lodash-es'
import config from '../config'
import {
  MandatorySubsectionsRequirement,
  ManuscriptTemplate,
  Publisher,
  RequirementType,
  ResearchField,
  SectionCategory,
  SectionDescription,
  TemplateData,
  TemplatesDataType,
} from '../types/templates'

export const DEFAULT_CATEGORY = 'MPManuscriptCategory:research-article'

const client = axios.create({
  baseURL: config.data.url,
})

const isMandatorySubsectionsRequirement = (
  requirement: Model
): requirement is MandatorySubsectionsRequirement =>
  requirement.objectType === 'MPMandatorySubsectionsRequirement'

export const prepareRequirements = (
  template: ManuscriptTemplate,
  templatesData?: Map<string, TemplatesDataType>
): RequirementType[] => {
  if (!templatesData) return []

  const requirementIDs: string[] = []

  if (template) {
    if (template.requirementIDs) {
      requirementIDs.push(...template.requirementIDs)
    }

    const extraRequirements: Array<keyof ManuscriptTemplate> = [
      'maxCharCountRequirement',
      'maxCombinedFigureTableCountRequirement',
      'maxWordCountRequirement',
      'minCombinedFigureTableCountRequirement',
    ]

    extraRequirements.forEach(key => {
      const requirementID = template[key]

      if (requirementID) {
        requirementIDs.push(requirementID as string)
      }
    })
  }

  return requirementIDs.map(id => {
    const requirement = templatesData.get(id)

    if (!requirement) {
      throw new Error(`Requirement not found: ${id}`)
    }

    return requirement as RequirementType
  })
}

export const categoriseSectionRequirements = (
  requirements: RequirementType[]
) => {
  const subsectionsRequirements = requirements.filter(
    isMandatorySubsectionsRequirement
  )

  const requiredSections: SectionDescription[] = []
  const manuscriptSections: SectionDescription[] = []

  for (const requirement of subsectionsRequirements) {
    for (const sectionDescription of requirement.embeddedSectionDescriptions) {
      switch (sectionDescription.sectionCategory) {
        // Handle Cover Letter requirement as a separate manuscript
        case 'MPSectionCategory:cover-letter':
          manuscriptSections.push(sectionDescription)
          break

        default:
          requiredSections.push(sectionDescription)
          break
      }
    }
  }

  return { requiredSections, manuscriptSections }
}

export const chooseSectionTitle = (
  sectionDescription: SectionDescription,
  sectionCategory?: SectionCategory
): string => {
  if (sectionDescription) {
    if (sectionDescription.title) {
      return sectionDescription.title
    }

    if (sectionDescription.titles && sectionDescription.titles[0]) {
      return sectionDescription.titles[0]
    }
  }

  if (sectionCategory) {
    return sectionCategory.name
  }

  return ''
}

export const buildSectionFromDescription = (
  sectionDescription: SectionDescription,
  priority: number,
  sectionCategory?: SectionCategory
) => {
  const dependencies = []

  const section = buildSection(priority)
  section.elementIDs = []

  const sectionTitle = chooseSectionTitle(sectionDescription, sectionCategory)

  section.title =
    sectionTitle.substr(0, 1).toUpperCase() + sectionTitle.substr(1)

  const choosePlaceholder = (): string | undefined => {
    if (sectionDescription.placeholder) {
      return sectionDescription.placeholder
    }

    if (sectionCategory && sectionCategory.desc) {
      return sectionCategory.desc
    }
  }

  const placeholder = choosePlaceholder()

  if (placeholder) {
    const paragraph = buildParagraph(
      `<p data-placeholder-text="${placeholder}"></p>`
    )

    paragraph.placeholderInnerHTML = placeholder

    dependencies.push(paragraph)

    section.elementIDs.push(paragraph._id)
  } else if (!sectionDescription.subsections) {
    const paragraph = buildParagraph('<p></p>')

    dependencies.push(paragraph)

    section.elementIDs.push(paragraph._id)
  }

  if (sectionDescription.subsections) {
    sectionDescription.subsections.map((subsectionDescription, index) => {
      const subsection = buildSection(index, [section._id])
      subsection.title = subsectionDescription.title

      if (subsectionDescription.placeholder) {
        const paragraph = buildParagraph(
          `<p data-placeholder-text="${subsectionDescription.placeholder}"></p>`
        )

        paragraph.placeholderInnerHTML = subsectionDescription.placeholder

        dependencies.push(paragraph)

        subsection.elementIDs = [paragraph._id]
      } else {
        const paragraph = buildParagraph('<p></p>')

        dependencies.push(paragraph)

        subsection.elementIDs = [paragraph._id]
      }

      dependencies.push(subsection)
    })
  }

  return { section, dependencies }
}

export const createManuscriptSectionsFromTemplate = (
  requiredSections: SectionDescription[],
  sectionCategories: Map<string, SectionCategory>
): Array<Build<ManuscriptModel>> => {
  let priority = 1

  const items: Array<Build<ManuscriptModel>> = []

  requiredSections.forEach(sectionDescription => {
    const sectionCategory = sectionCategories.get(
      sectionDescription.sectionCategory
    )

    const { section, dependencies } = buildSectionFromDescription(
      sectionDescription,
      priority++,
      sectionCategory
    )

    items.push(...dependencies)
    items.push(section)
  })

  return items
}

export const fromPrototype = <T extends Model>(model: T): T => {
  const output = {
    ...model,
    prototype: model._id,
    _id: generateID(model.objectType as ObjectType),
  }

  return output as T // TODO: add prototype to Model schema
}

export const createMergedTemplate = (
  template: ManuscriptTemplate,
  manuscriptTemplates?: Map<string, ManuscriptTemplate>
) => {
  if (!manuscriptTemplates) {
    return template
  }

  let mergedTemplate = { ...template }

  let parentTemplateID = mergedTemplate.parent

  while (parentTemplateID) {
    const parentTemplate = manuscriptTemplates.get(parentTemplateID)

    if (!parentTemplate) {
      break
    }

    mergedTemplate = mergeWith(
      mergedTemplate,
      parentTemplate,
      (objValue, srcValue) => {
        if (Array.isArray(objValue)) {
          // TODO: only merge requirementIDs?
          return objValue.concat(srcValue) // merge arrays
        }

        return objValue === undefined ? srcValue : objValue
      }
    )

    parentTemplateID = parentTemplate.parent
  }

  delete mergedTemplate.parent

  return fromPrototype<ManuscriptTemplate>(mergedTemplate)
}

export const createEmptyParagraph = () => {
  const placeholderText =
    'Start from here. Enjoy writing! - the Manuscripts Team.'

  const paragraph = buildParagraph(
    `<p data-placeholder-text="${placeholderText}"></p>`
  )

  paragraph.placeholderInnerHTML = placeholderText

  return paragraph
}

export const buildCategories = (items: Map<string, ManuscriptCategory>) =>
  Array.from(items.values()).sort(
    (a, b) => Number(a.priority) - Number(b.priority)
  )

export const buildResearchFields = (items: Map<string, ResearchField>) =>
  Array.from(items.values()).sort(
    (a, b) => Number(a.priority) - Number(b.priority)
  )

export const buildItems = (
  templates: Map<string, ManuscriptTemplate>,
  bundles: Map<string, Bundle>,
  publishers: Map<string, Publisher>
): TemplateData[] => {
  const templateItems = Array.from(templates.values())
    .filter(template => !template.hidden)
    .map(buildTemplateData(templates, bundles, publishers))
    .sort((a, b) => a.title.localeCompare(b.title))

  const templateBundles = new Set()

  templateItems.forEach(item => {
    if (item.bundle) {
      templateBundles.add(item.bundle._id)
    }
  })

  const bundleItems = Array.from(bundles.values())
    .filter(
      bundle =>
        !templateBundles.has(bundle._id) && bundle.csl && bundle.csl.title
    )
    .map(bundle => ({
      bundle,
      title: bundle.csl!.title!,
      category: DEFAULT_CATEGORY,
    }))
    .sort((a, b) => a.title.localeCompare(b.title))

  return [...templateItems, ...bundleItems]
}

export const buildJournalTitle = (
  template: ManuscriptTemplate,
  bundle?: Bundle
) =>
  bundle && bundle.csl && bundle.csl.title
    ? bundle.csl.title
    : template.title.replace(/\s+Journal\s+Publication\s*/, '').trim()

export const buildArticleType = (template: ManuscriptTemplate) =>
  template.title.replace(/Journal\s+Publication/, '').trim()

export const findParentTemplate = (
  templates: Map<string, ManuscriptTemplate>,
  parent: string
) => {
  if (parent.startsWith('MPManuscriptTemplate:')) {
    return templates.get(parent)
  }

  for (const template of templates.values()) {
    if (template.title === parent) {
      return template
    }
  }

  return undefined
}

export const buildTemplateData = (
  templates: Map<string, ManuscriptTemplate>,
  bundles: Map<string, Bundle>,
  publishers: Map<string, Publisher>
) => (template: ManuscriptTemplate): TemplateData => {
  while (template.parent) {
    const parentTemplate = findParentTemplate(templates, template.parent)

    delete template.parent

    if (parentTemplate) {
      template = {
        ...parentTemplate,
        ...template,
      }
    }
  }

  const bundle = template.bundle ? bundles.get(template.bundle) : undefined

  const title = buildJournalTitle(template, bundle)

  const articleType = buildArticleType(template)

  const publisher = template.publisher
    ? publishers.get(template.publisher)
    : undefined

  const category = template.category || DEFAULT_CATEGORY

  return {
    template,
    bundle,
    title,
    articleType,
    publisher,
    category,
  }
}

export const fetchSharedData = <T extends Model>(file: string) =>
  client
    .get<T[]>(`/shared/${file}.json`)
    .then(
      response =>
        new Map<string, T>(
          response.data.map<[string, T]>(item => [item._id, item])
        )
    )

export const buildManuscriptTitle = (item: TemplateData): string =>
  ['Untitled', item.title, item.articleType || 'Journal Article']
    .filter(_ => _)
    .join(' ')

export const findBundle = (template?: ManuscriptTemplate) =>
  template && template.bundle ? template.bundle : DEFAULT_BUNDLE
