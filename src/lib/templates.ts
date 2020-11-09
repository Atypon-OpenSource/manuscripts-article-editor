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
  fromPrototype,
  generateID,
  ManuscriptModel,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  ManuscriptCategory,
  ManuscriptTemplate,
  Model,
  ObjectTypes,
  PageLayout,
  Publisher,
  ResearchField,
  Section,
  SectionCategory,
  SectionDescription,
} from '@manuscripts/manuscripts-json-schema'
import { mergeWith } from 'lodash-es'

import {
  Requirement,
  SectionCountRequirement,
  sectionCountRequirementFields,
} from './requirements'
import { SharedData } from './shared-data'

export type ManuscriptTemplateData = Pick<
  ManuscriptTemplate,
  Exclude<
    keyof ManuscriptTemplate,
    'containerID' | 'manuscriptID' | 'sessionID'
  >
>

export interface TemplateData {
  template?: ManuscriptTemplateData
  bundle?: Bundle
  title: string
  articleType?: string
  publisher?: Publisher
  category?: string
  titleAndType: string
}

export type TemplatesDataType = ManuscriptTemplate | Requirement

export const RESEARCH_ARTICLE_CATEGORY = 'MPManuscriptCategory:research-article'
export const COVER_LETTER_CATEGORY = 'MPManuscriptCategory:cover-letter'
export const DEFAULT_CATEGORY = RESEARCH_ARTICLE_CATEGORY

export const COVER_LETTER_SECTION_CATEGORY = 'MPSectionCategory:cover-letter'
export const COVER_LETTER_PLACEHOLDER =
  'A letter sent along with your manuscript to explain it.'

const sectionRequirementTypes = new Map<keyof SectionDescription, ObjectTypes>([
  ['maxCharCount', ObjectTypes.MaximumSectionCharacterCountRequirement],
  ['maxWordCount', ObjectTypes.MaximumSectionWordCountRequirement],
  ['minCharCount', ObjectTypes.MinimumSectionCharacterCountRequirement],
  ['minWordCount', ObjectTypes.MinimumSectionWordCountRequirement],
])

export const prepareSectionRequirements = (
  section: Build<Section>,
  sectionDescription: SectionDescription,
  templatesData?: Map<string, TemplatesDataType>
): Array<Build<SectionCountRequirement>> => {
  if (!templatesData) {
    return []
  }

  const requirements: Array<Build<SectionCountRequirement>> = []

  for (const [
    sectionField,
    sectionDescriptionField,
  ] of sectionCountRequirementFields) {
    const count = sectionDescription[sectionDescriptionField]
    const objectType = sectionRequirementTypes.get(sectionDescriptionField)

    if (count !== undefined && objectType !== undefined) {
      const newRequirement: Build<SectionCountRequirement> = {
        _id: generateID(objectType),
        objectType,
        count,
        severity: 0,
        ignored: false,
      }

      requirements.push(newRequirement)

      section[sectionField] = newRequirement._id
    }
  }

  return requirements
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

// the content in these sections is automatically generated
const generatedSections = [
  'MPSectionCategory:bibliography',
  'MPSectionCategory:keywords',
  'MPSectionCategory:toc',
]

export const buildSectionFromDescription = (
  templatesData: Map<string, TemplatesDataType>,
  sectionDescription: SectionDescription,
  sectionCategory?: SectionCategory
) => {
  const dependencies: Array<Build<Model>> = []

  const section = buildSection(sectionCategory?.priority || 1)
  section.elementIDs = []

  const sectionTitle = chooseSectionTitle(sectionDescription, sectionCategory)

  section.title =
    sectionTitle.substr(0, 1).toUpperCase() + sectionTitle.substr(1)

  if (sectionCategory) {
    section.category = sectionCategory._id

    // avoid adding invalid empty paragraphs to generated sections
    if (generatedSections.includes(section.category)) {
      return { section, dependencies }
    }
  }

  // const paragraphStyle =
  //   sectionDescription.paragraphStyle && modelMap
  //     ? getByPrototype<ParagraphStyle>(
  //         sectionDescription.paragraphStyle,
  //         modelMap
  //       )
  //     : undefined

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

    // if (paragraphStyle) {
    //   paragraph.paragraphStyle = paragraphStyle._id
    // }

    paragraph.placeholderInnerHTML = placeholder

    dependencies.push(paragraph)

    section.elementIDs.push(paragraph._id)
  } else if (!sectionDescription.subsections) {
    const paragraph = buildParagraph('')

    // if (paragraphStyle) {
    //   paragraph.paragraphStyle = paragraphStyle._id
    // }

    dependencies.push(paragraph)

    section.elementIDs.push(paragraph._id)
  }

  if (sectionDescription.subsections) {
    sectionDescription.subsections.map((subsectionDescription, index) => {
      // const paragraphStyle =
      //   subsectionDescription.paragraphStyle && modelMap
      //     ? getByPrototype<ParagraphStyle>(
      //         subsectionDescription.paragraphStyle,
      //         modelMap
      //       )
      //     : undefined

      const paragraph = buildParagraph(subsectionDescription.placeholder || '')
      // if (paragraphStyle) {
      //   paragraph.paragraphStyle = paragraphStyle._id
      // }

      dependencies.push(paragraph)

      const subsection = buildSection(index, [section._id])
      subsection.title = subsectionDescription.title
      subsection.elementIDs = [paragraph._id]

      dependencies.push(subsection)
    })
  }

  const requirements = prepareSectionRequirements(
    section,
    sectionDescription,
    templatesData
  )

  for (const requirement of requirements) {
    dependencies.push(requirement)
  }

  return { section, dependencies }
}

export const createManuscriptSectionsFromTemplate = (
  templatesData: Map<string, TemplatesDataType>,
  sectionCategories: Map<string, SectionCategory>,
  sectionDescriptions: SectionDescription[]
): Array<Build<ManuscriptModel>> => {
  const items: Array<Build<ManuscriptModel>> = []

  for (const sectionDescription of sectionDescriptions) {
    const sectionCategory = sectionCategories.get(
      sectionDescription.sectionCategory
    ) as SectionCategory

    // exclude "Cover Letter" sections, as they're separate manuscripts now
    if (sectionCategory._id === COVER_LETTER_SECTION_CATEGORY) {
      continue
    }

    const { section, dependencies } = buildSectionFromDescription(
      templatesData,
      sectionDescription,
      sectionCategory
    )

    items.push(...dependencies)
    items.push(section)
  }

  return items
}

const findBundleByURL = (
  url: string,
  bundles: Map<string, Bundle>
): Bundle | undefined => {
  for (const bundle of bundles.values()) {
    if (bundle.csl && bundle.csl['self-URL'] === url) {
      return bundle
    }
  }
}

export const createParentBundle = (
  bundle: Bundle,
  bundles: Map<string, Bundle>
): Bundle | undefined => {
  if (bundle.csl) {
    const parentURL = bundle.csl['independent-parent-URL']

    if (parentURL) {
      const parentBundle = findBundleByURL(parentURL, bundles)

      if (!parentBundle) {
        throw new Error(`Bundle with URL not found: ${parentURL} `)
      }

      return fromPrototype<Bundle>(parentBundle)
    }
  }
}

export const createNewBundle = (
  bundleID: string,
  bundles: Map<string, Bundle>
): Bundle => {
  const bundle = bundles.get(bundleID)

  if (!bundle) {
    throw new Error(`Bundle not found: ${bundleID}`)
  }

  return fromPrototype<Bundle>(bundle)
}

export const createMergedTemplate = (
  template: ManuscriptTemplateData,
  manuscriptTemplates?: Map<string, ManuscriptTemplateData>
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
          // TODO: ensure uniqueness?
          return objValue.concat(srcValue) // merge arrays
        }

        return objValue === undefined ? srcValue : objValue
      }
    )

    parentTemplateID = parentTemplate.parent
  }

  // TODO: keep the origin template ID?

  delete mergedTemplate.parent

  // TODO: no need to create a prototype as it isn't saved?
  return mergedTemplate
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

const sortTemplateItems = (a: TemplateData, b: TemplateData) =>
  a.title.localeCompare(b.title)

export const buildItems = (sharedData: SharedData): TemplateData[] => {
  const buildTemplateData = buildTemplateDataFactory(sharedData)

  // user templates
  const userTemplateItems: TemplateData[] = []

  for (const template of sharedData.userManuscriptTemplates.values()) {
    userTemplateItems.push(buildTemplateData(template))
  }

  // bundled templates
  const templateItems: TemplateData[] = []

  for (const template of sharedData.manuscriptTemplates.values()) {
    if (!template.hidden) {
      templateItems.push(buildTemplateData(template))
    }
  }

  // bundles that aren't already attached to templates
  const templateBundles = new Set()

  templateItems.forEach((item) => {
    if (item.bundle) {
      templateBundles.add(item.bundle._id)
    }
  })

  const bundleItems: TemplateData[] = []

  for (const bundle of sharedData.bundles.values()) {
    if (!templateBundles.has(bundle._id) && bundle.csl && bundle.csl.title) {
      bundleItems.push({
        bundle,
        title: bundle.csl.title,
        category: DEFAULT_CATEGORY,
        titleAndType: bundle.csl.title,
      })
    }
  }

  return [
    ...userTemplateItems.sort(sortTemplateItems), // sort the user template items and show them first
    ...[...templateItems, ...bundleItems].sort(sortTemplateItems), // sort the bundled items and show them last
  ]
}

export const buildJournalTitle = (
  template: ManuscriptTemplate,
  parentTemplate?: ManuscriptTemplate,
  bundle?: Bundle
): string => {
  return chooseJournalTitle(template, parentTemplate, bundle)
    .replace(/\s+Journal\s+Publication\s*/, '')
    .trim()
}

const chooseJournalTitle = (
  template: ManuscriptTemplate,
  parentTemplate?: ManuscriptTemplate,
  bundle?: Bundle
): string => {
  return parentTemplate?.title || template.title || bundle?.csl?.title || ''
}

export const buildArticleType = (
  template: ManuscriptTemplate,
  parentTemplate?: ManuscriptTemplate
) => {
  const title = parentTemplate?.title
    ? template.title.replace(parentTemplate.title, '')
    : template.title

  return title.replace(/Journal\s+Publication/, '').trim()
}

export const findParentTemplate = (
  templates: Map<string, ManuscriptTemplate>,
  userTemplates: Map<string, ManuscriptTemplate>,
  parent: string
) => {
  if (parent.startsWith('MPManuscriptTemplate:')) {
    return userTemplates.get(parent) || templates.get(parent)
  }

  for (const template of userTemplates.values()) {
    if (template.title === parent) {
      return template
    }
  }

  for (const template of templates.values()) {
    if (template.title === parent) {
      return template
    }
  }

  return undefined
}

export const buildTemplateDataFactory = (sharedData: SharedData) => (
  template: ManuscriptTemplate
): TemplateData => {
  const parentTemplate = template.parent
    ? findParentTemplate(
        sharedData.manuscriptTemplates,
        sharedData.userManuscriptTemplates,
        template.parent
      )
    : undefined

  const bundleID = template.bundle || parentTemplate?.bundle

  const bundle = bundleID ? sharedData.bundles.get(bundleID) : undefined

  const title = buildJournalTitle(template, parentTemplate, bundle)

  const articleType = buildArticleType(template)

  const publisherID = template.publisher || parentTemplate?.publisher

  const publisher = publisherID
    ? sharedData.publishers.get(publisherID)
    : undefined

  const category =
    template.category || parentTemplate?.category || DEFAULT_CATEGORY

  const titleAndType = [title, articleType].join(' ')

  return {
    template,
    bundle,
    title,
    articleType,
    publisher,
    category,
    titleAndType,
  }
}

export const chooseBundleID = (item?: TemplateData) =>
  item?.template?.bundle || item?.bundle?._id || DEFAULT_BUNDLE
