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
  buildParagraph,
  buildSection,
  DEFAULT_BUNDLE,
  DEFAULT_PAGE_LAYOUT,
  generateID,
  ManuscriptModel,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  ManuscriptCategory,
  Model,
  ObjectTypes,
  PageLayout,
  ParagraphStyle,
} from '@manuscripts/manuscripts-json-schema'
import { mergeWith } from 'lodash-es'
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

export const RESEARCH_ARTICLE_CATEGORY = 'MPManuscriptCategory:research-article'
export const COVER_LETTER_CATEGORY = 'MPManuscriptCategory:cover-letter'
export const DEFAULT_CATEGORY = RESEARCH_ARTICLE_CATEGORY

export const COVER_LETTER_SECTION_CATEGORY = 'MPSectionCategory:cover-letter'
export const COVER_LETTER_PLACEHOLDER =
  'A letter sent along with your manuscript to explain it.'

export const isMandatorySubsectionsRequirement = (
  requirement: Model
): requirement is MandatorySubsectionsRequirement =>
  requirement.objectType === 'MPMandatorySubsectionsRequirement'

export const isCoverLetter = (
  sectionDescription: SectionDescription
): boolean =>
  sectionDescription.sectionCategory === COVER_LETTER_SECTION_CATEGORY

export const findCoverLetterDescription = (
  requirements: MandatorySubsectionsRequirement[]
): SectionDescription | undefined => {
  for (const requirement of requirements) {
    for (const sectionDescription of requirement.embeddedSectionDescriptions) {
      if (isCoverLetter(sectionDescription)) {
        return sectionDescription
      }
    }
  }
}

export const createCoverLetterDescription = (): SectionDescription => ({
  _id: generateID(ObjectTypes.SectionDescription),
  objectType: ObjectTypes.SectionDescription,
  sectionCategory: COVER_LETTER_SECTION_CATEGORY,
})

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
    const paragraph = buildParagraph(placeholder)

    paragraph.placeholderInnerHTML = placeholder

    dependencies.push(paragraph)

    section.elementIDs.push(paragraph._id)
  } else if (!sectionDescription.subsections) {
    const paragraph = buildParagraph('')

    dependencies.push(paragraph)

    section.elementIDs.push(paragraph._id)
  }

  if (sectionDescription.subsections) {
    sectionDescription.subsections.map((subsectionDescription, index) => {
      const subsection = buildSection(index, [section._id])
      subsection.title = subsectionDescription.title

      if (subsectionDescription.placeholder) {
        const paragraph = buildParagraph(subsectionDescription.placeholder)

        paragraph.placeholderInnerHTML = subsectionDescription.placeholder

        dependencies.push(paragraph)

        subsection.elementIDs = [paragraph._id]
      } else {
        const paragraph = buildParagraph('')

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

export const fromPrototype = <T extends Model>(model: T) => {
  const output = {
    ...model,
    prototype: model._id,
    _id: generateID(model.objectType as ObjectTypes),
  }

  return output as T & { prototype: string }
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

export const createEmptyParagraph = (pageLayout: PageLayout) => {
  const placeholderText =
    'Start from here. Enjoy writing! - the Manuscripts Team.'

  const paragraph = buildParagraph(placeholderText)

  paragraph.placeholderInnerHTML = placeholderText
  paragraph.paragraphStyle = pageLayout.defaultParagraphStyle

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
  import(`@manuscripts/data/dist/shared/${file}.json`)
    .then(module => module.default as T[])
    .then(
      items =>
        new Map<string, T>(items.map<[string, T]>(item => [item._id, item]))
    )

export const chooseBundleID = (template?: ManuscriptTemplate) =>
  template && template.bundle ? template.bundle : DEFAULT_BUNDLE

export const createNewStyles = (styles: Map<string, Model>) => {
  const newStyles = new Map<string, Model>()

  const prototypeMap = new Map<string, string>()

  for (const style of styles.values()) {
    const newStyle = fromPrototype(style)
    newStyles.set(newStyle._id, newStyle)

    prototypeMap.set(newStyle.prototype, newStyle._id)
  }

  // this.fixReferencedStyleIds(newStyles, prototypeMap)

  return newStyles
}

export const getByPrototype = <T extends Model>(
  prototype: string,
  modelMap: Map<string, Model>
): T | undefined => {
  for (const model of modelMap.values()) {
    if (model.prototype === prototype) {
      return model as T
    }
  }
}

export const updatedPageLayout = (newStyles: Map<string, Model>) => {
  const newPageLayout = getByPrototype<PageLayout>(
    DEFAULT_PAGE_LAYOUT,
    newStyles
  )

  if (!newPageLayout) {
    throw new Error('Default page layout not found')
  }

  const newDefaultParagraphStyle = getByPrototype<ParagraphStyle>(
    newPageLayout.defaultParagraphStyle,
    newStyles
  )

  if (!newDefaultParagraphStyle) {
    throw new Error('Default paragraph style not found')
  }

  newPageLayout.defaultParagraphStyle = newDefaultParagraphStyle._id

  // newStyles.set(newPageLayout._id, newPageLayout)

  return newPageLayout
}
