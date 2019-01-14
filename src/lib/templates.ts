import {
  Build,
  buildManuscript,
  buildParagraph,
  buildSection,
  DEFAULT_BUNDLE,
} from '@manuscripts/manuscript-editor'
import {
  Bundle,
  ManuscriptCategory,
  Model,
} from '@manuscripts/manuscripts-json-schema'
import axios from 'axios'
import config from '../config'
import { ModelIDs } from '../store/ModelsProvider'
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

export const createManuscriptSectionsFromTemplate = async (
  requiredSections: SectionDescription[],
  sectionCategories: Map<string, SectionCategory>,
  saveModelWithIDs: (model: Build<Model>) => Promise<Model>
) => {
  let previousPriority = -1

  await Promise.all(
    requiredSections.map(async sectionDescription => {
      const sectionCategory = sectionCategories.get(
        sectionDescription.sectionCategory
      )

      const priority =
        sectionCategory && sectionCategory.priority
          ? sectionCategory.priority
          : previousPriority + 1

      previousPriority = priority

      const section = buildSection(priority)
      section.elementIDs = []

      const sectionTitle =
        sectionDescription.title ||
        sectionCategory!.titles[0] ||
        sectionCategory!.name

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

        await saveModelWithIDs(paragraph)

        section.elementIDs.push(paragraph._id)
      } else if (!sectionDescription.subsections) {
        const paragraph = buildParagraph('<p></p>')

        await saveModelWithIDs(paragraph)

        section.elementIDs.push(paragraph._id)
      }

      if (sectionDescription.subsections) {
        await Promise.all(
          sectionDescription.subsections.map(
            async (subsectionDescription, index) => {
              const subsection = buildSection(index, [section._id])
              subsection.title = subsectionDescription.title

              if (subsectionDescription.placeholder) {
                const paragraph = buildParagraph(
                  `<p data-placeholder-text="${
                    subsectionDescription.placeholder
                  }"></p>`
                )

                paragraph.placeholderInnerHTML =
                  subsectionDescription.placeholder

                await saveModelWithIDs(paragraph)

                subsection.elementIDs = [paragraph._id]
              } else {
                const paragraph = buildParagraph('<p></p>')

                await saveModelWithIDs(paragraph)

                subsection.elementIDs = [paragraph._id]
              }

              await saveModelWithIDs(subsection)
            }
          )
        )
      }

      await saveModelWithIDs(section)
    })
  )
}

export const createEmptyManuscriptSections = async (
  saveModelWithIDs: (model: Build<Model>) => Promise<Model>
) => {
  const placeholderText =
    'Start from here. Enjoy writing! - the Manuscripts Team.'

  const paragraph = buildParagraph(
    `<p data-placeholder-text="${placeholderText}"></p>`
  )

  paragraph.placeholderInnerHTML = placeholderText

  await saveModelWithIDs(paragraph)

  const section = buildSection()

  section.elementIDs = [paragraph._id]

  await saveModelWithIDs(section)
}

export const saveParentTemplates = async (
  template: ManuscriptTemplate,
  saveModelWithIDs: (model: Build<Model>) => Promise<Model>,
  manuscriptTemplates?: Map<string, ManuscriptTemplate>
) => {
  if (!manuscriptTemplates) return

  let parentTemplateID = template.parent

  while (parentTemplateID) {
    const parentTemplate = manuscriptTemplates.get(parentTemplateID)

    if (!parentTemplate) {
      break
    }

    await saveModelWithIDs(parentTemplate)

    parentTemplateID = parentTemplate.parent
  }
}

export const saveTemplate = async (
  template: ManuscriptTemplate,
  saveModelWithIDs: (model: Build<Model>) => Promise<Model>,
  manuscriptTemplates?: Map<string, ManuscriptTemplate>
) => {
  if (!manuscriptTemplates) return

  const data = manuscriptTemplates.get(template._id)

  if (!data) return

  await saveModelWithIDs(data)
}

export const saveCategory = async (
  template: ManuscriptTemplate,
  saveModelWithIDs: (model: Build<Model>) => Promise<Model>,
  manuscriptCategories?: Map<string, ManuscriptCategory>
) => {
  if (!manuscriptCategories) return

  const categoryID = template.category

  if (categoryID) {
    const category = manuscriptCategories.get(categoryID)

    if (category) {
      await saveModelWithIDs(category)
    }
  }
}

export const createExtraManuscripts = async (
  manuscriptSections: SectionDescription[],
  saveModel: <T extends Model>(model: Build<T>, ids: ModelIDs) => Promise<T>,
  projectID: string,
  template?: ManuscriptTemplate
) => {
  for (const sectionDescription of manuscriptSections) {
    const extraManuscript = buildManuscript(sectionDescription.title)

    if (template && template.bundle) {
      extraManuscript.bundle = template.bundle
    }

    await saveModel(extraManuscript, {
      manuscriptID: extraManuscript._id,
      projectID,
    })
  }
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
