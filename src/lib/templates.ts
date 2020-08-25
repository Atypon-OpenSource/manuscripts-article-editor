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

import { loadStyle } from '@manuscripts/library'
import {
  Build,
  buildParagraph,
  buildSection,
  ContainedModel,
  DEFAULT_BUNDLE,
  DEFAULT_PAGE_LAYOUT,
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
  ParagraphStyle,
  ResearchField,
  Section,
  SectionCategory,
  SectionDescription,
} from '@manuscripts/manuscripts-json-schema'
import { mergeWith } from 'lodash-es'
import { SharedData } from '../components/templates/TemplateSelector'
import { Collection } from '../sync/Collection'
import {
  ManuscriptTemplateData,
  TemplateData,
  TemplatesDataType,
} from '../types/templates'
import {
  SectionCountRequirement,
  sectionCountRequirementFields,
} from './requirements'
import { isParagraphStyle } from './styles'

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
  if (!templatesData) return []

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

// tslint:disable-next-line:cyclomatic-complexity
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

const findBundleByURL = (url: string, bundles: Map<string, Bundle>) => {
  for (const bundle of bundles.values()) {
    if (bundle.csl && bundle.csl['self-URL'] === url) {
      return bundle
    }
  }
}

export const createParentBundle = (
  bundle: Bundle,
  bundles: Map<string, Bundle>
) => {
  if (bundle.csl) {
    const parentURL = bundle.csl['independent-parent-URL']

    if (parentURL) {
      const parentBundle = findBundleByURL(parentURL, bundles)

      if (!parentBundle) {
        throw new Error(`Bundle with URL not found: ${parentURL} `)
      }

      return fromPrototype(parentBundle)
    }
  }
}

export const createNewBundle = (
  bundleID: string,
  bundles: Map<string, Bundle>
) => {
  const bundle = bundles.get(bundleID)

  if (!bundle) {
    throw new Error(`Bundle not found: ${bundleID}`)
  }

  return fromPrototype(bundle)
}

export const attachStyle = async (
  newBundle: Bundle,
  collection: Collection<ContainedModel>
) => {
  if (newBundle.csl && newBundle.csl.cslIdentifier) {
    const data = await loadStyle(newBundle.csl.cslIdentifier)

    await collection.putAttachment(newBundle._id, {
      id: 'csl',
      type: 'application/vnd.citationstyles.style+xml',
      data,
    })
  }
}

export const fromPrototype = <T extends Model>(model: T) => {
  const { _rev, ...data } = model

  const output = {
    ...data,
    prototype: model._id,
    _id: generateID(model.objectType as ObjectTypes),
  }

  return output as T & { prototype?: string }
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

  delete mergedTemplate.parent

  return fromPrototype<ManuscriptTemplateData>(mergedTemplate)
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

  templateItems.forEach(item => {
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
      })
    }
  }

  return [
    ...userTemplateItems.sort(sortTemplateItems), // sort the user template items and show them first
    ...[...templateItems, ...bundleItems].sort(sortTemplateItems), // sort the bundled items and show them last
  ]
}

// export const buildJournalTitle = (
//   template: ManuscriptTemplate,
//   bundle?: Bundle
// ) =>
//   bundle && bundle.csl && bundle.csl.title
//     ? bundle.csl.title
//     : template.title.replace(/\s+Journal\s+Publication\s*/, '').trim()

export const buildJournalTitle = (
  template: ManuscriptTemplate,
  bundle?: Bundle
): string =>
  template.title
    ? template.title.replace(/\s+Journal\s+Publication\s*/, '').trim()
    : (bundle && bundle.csl && bundle.csl.title) || ''

export const buildArticleType = (template: ManuscriptTemplate) =>
  template.title.replace(/Journal\s+Publication/, '').trim()

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
  while (template.parent) {
    const parentTemplate = findParentTemplate(
      sharedData.manuscriptTemplates,
      sharedData.userManuscriptTemplates,
      template.parent
    )

    delete template.parent

    if (parentTemplate) {
      template = {
        ...parentTemplate,
        ...template,
      }
    }
  }

  const bundle = template.bundle
    ? sharedData.bundles.get(template.bundle)
    : undefined

  const title = buildJournalTitle(template, bundle)

  const articleType = buildArticleType(template)

  const publisher = template.publisher
    ? sharedData.publishers.get(template.publisher)
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

export const chooseBundleID = (item: TemplateData) => {
  if (item.template && item.template.bundle) {
    return item.template.bundle
  }

  if (item.bundle && item.bundle) {
    return item.bundle._id
  }

  return DEFAULT_BUNDLE
}

// export const createNewStyles = (styles: Map<string, Model>) => {
//   const newStyles = new Map<string, Model>()
//
//   const prototypeMap = new Map<string, string>()
//
//   for (const style of styles.values()) {
//     const newStyle = fromPrototype(style)
//     newStyles.set(newStyle._id, newStyle)
//
//     prototypeMap.set(newStyle.prototype, newStyle._id)
//   }
//
//   for (const style of newStyles.values()) {
//     fixReferencedIds(style, prototypeMap)
//   }
//
//   return newStyles
// }

export const createNewTemplateStyles = (
  styles: Map<string, Model>,
  templateStyleIDs: string[]
) => {
  const newStyles = new Map<string, Model>()

  for (const styleID of templateStyleIDs) {
    const style = (styles.get(styleID) as ParagraphStyle) || undefined

    if (style) {
      const newStyle = fromPrototype(style)
      // newStyle.prototype = style.prototype // NOTE: different from bundled styles
      newStyles.set(newStyle._id, newStyle)
    }
  }

  // this.fixReferencedStyleIds(newStyles, prototypeMap)

  return newStyles
}

export const createNewBundledStyles = (styles: Map<string, Model>) => {
  const newStyles = new Map<string, Model>()

  for (const style of styles.values()) {
    if (style.bundled) {
      const newStyle = fromPrototype(style)
      newStyles.set(newStyle._id, newStyle)
    }
  }

  // this.fixReferencedStyleIds(newStyles, prototypeMap)

  return newStyles
}

const ignoreKeys = ['_id', 'prototype']

const fixReferencedIds = (model: Model, prototypeMap: Map<string, string>) => {
  for (const [key, value] of Object.entries(model)) {
    if (ignoreKeys.includes(key)) {
      continue
    }

    if (value._id) {
      // nested object
      fixReferencedIds(value, prototypeMap)
    } else {
      if (prototypeMap.has(value)) {
        // @ts-ignore
        model[key] = prototypeMap.get(value) as string
      }
    }
  }
}

export const createNewItems = <S extends Model>(items: Map<string, S>) => {
  const newItems = new Map<string, S>()

  for (const item of items.values()) {
    const newItem = fromPrototype(item)
    newItems.set(newItem._id, newItem)
  }

  return newItems
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

const chooseNewDefaultParagraphStyle = (newStyles: Map<string, Model>) => {
  for (const style of newStyles.values()) {
    if (isParagraphStyle(style)) {
      if (style.title === 'Body Text') {
        // TODO: something stricter?
        return style
      }
    }
  }
}

export const updatedPageLayout = (
  newStyles: Map<string, Model>,
  template?: ManuscriptTemplateData
) => {
  const newPageLayout = getByPrototype<PageLayout>(
    template && template.pageLayout ? template.pageLayout : DEFAULT_PAGE_LAYOUT,
    newStyles
  )

  if (!newPageLayout) {
    throw new Error('Default page layout not found')
  }

  const newDefaultParagraphStyle =
    getByPrototype<ParagraphStyle>(
      newPageLayout.defaultParagraphStyle,
      newStyles
    ) || chooseNewDefaultParagraphStyle(newStyles)

  if (!newDefaultParagraphStyle) {
    throw new Error('Default paragraph style not found')
  }

  newPageLayout.defaultParagraphStyle = newDefaultParagraphStyle._id

  // newStyles.set(newPageLayout._id, newPageLayout)

  return newPageLayout
}
