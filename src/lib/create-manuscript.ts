/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2020 Atypon Systems LLC. All Rights Reserved.
 */

import {
  Build,
  buildContributor,
  buildManuscript,
  buildParagraph,
  buildProject,
  buildSection,
  ContainedModel,
  DEFAULT_PAGE_LAYOUT,
  fromPrototype,
  hasObjectType,
  isManuscriptModel,
  loadBundledDependencies,
  loadContributorRoles,
  loadKeywords,
  StyleObject,
  updatedPageLayout,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  Contributor,
  ContributorRole,
  MandatorySubsectionsRequirement,
  Manuscript,
  ManuscriptCoverLetterRequirement,
  Model,
  ObjectTypes,
  ParagraphElement,
  Project,
  Section,
  SectionDescription,
  StatusLabel,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { History } from 'history'

import { Database } from '../components/DatabaseProvider'
import { isBulkDocsError } from '../sync/Collection'
import { loadBundle } from './bundles'
import { createAndPushNewProject, createProjectCollection } from './collections'
import { BulkCreateError } from './errors'
import { nextManuscriptPriority } from './manuscript'
import { postWebkitMessage } from './native'
import { manuscriptCountRequirementFields, Requirement } from './requirements'
import { SharedData } from './shared-data'
import { Style } from './styles'
import {
  COVER_LETTER_CATEGORY,
  COVER_LETTER_PLACEHOLDER,
  COVER_LETTER_SECTION_CATEGORY,
  createEmptyParagraph,
  createManuscriptSectionsFromTemplate,
  ManuscriptTemplateData,
  RESEARCH_ARTICLE_CATEGORY,
} from './templates'
import { trackEvent } from './tracking'

const buildNewProject = ({
  projectID,
  user,
}: {
  projectID?: string
  user: UserProfile
}): Build<Project> | undefined =>
  projectID ? undefined : buildProject(user.userID)

const sendNewProjectNotification = (projectID: string) => {
  postWebkitMessage('action', {
    name: 'assign-project',
    projectID,
  })
}

interface CreateManuscriptProps {
  addContent?: boolean
  analyticsTemplateName: string
  bundleID: string
  data: SharedData
  db: Database
  history: History
  projectID?: string
  prototype?: string
  template?: ManuscriptTemplateData
  user: UserProfile
}

interface ContainedIDs {
  containerID: string
  manuscriptID?: string
}

const isStatusLabel = hasObjectType<StatusLabel>(ObjectTypes.StatusLabel)

// tslint:disable-next-line:cyclomatic-complexity
export const createManuscript = async ({
  addContent = false,
  analyticsTemplateName,
  bundleID,
  data,
  db,
  history,
  projectID,
  prototype,
  template,
  user,
}: CreateManuscriptProps) => {
  const newProject = buildNewProject({ projectID, user })

  if (newProject) {
    await createAndPushNewProject(newProject)
  }

  const containerID: string = newProject ? newProject._id : projectID!

  const collection = await createProjectCollection(db, containerID)

  const priority = newProject ? 1 : await nextManuscriptPriority(collection)

  // build the manuscript
  const manuscript: Build<Manuscript> & { prototype?: string } = {
    ...buildManuscript(),
    // colorScheme: colorScheme ? colorScheme._id : DEFAULT_COLOR_SCHEME,
    priority,
    prototype,
  }

  // collect the models that make up the manuscript
  const dependencies: Array<Build<ContainedModel> & ContainedIDs> = []

  const addDependency = <T extends Model>(
    model: Build<T>,
    containedIDs: ContainedIDs = { containerID: '' }
  ) => {
    dependencies.push({ ...model, ...containedIDs })
  }

  const addContainedModel = <T extends Model>(model: Build<T>) => {
    const containerIDs: ContainedIDs = { containerID }

    if (isManuscriptModel(model as T)) {
      containerIDs.manuscriptID = manuscript._id
    }

    addDependency(model, containerIDs)
  }

  const addContainedModels = <T extends Model>(models: Array<Build<T>>) => {
    for (const model of models) {
      addContainedModel(model)
    }
  }

  // add the current user as the first author
  addContainedModel<Contributor>(
    buildContributor(user.bibliographicName, 'author', 0, user.userID)
  )

  // bundled styles, keywords and contributor roles
  if (template) {
    const keywords = await loadKeywords()
    addContainedModels<StatusLabel>(
      keywords.filter(isStatusLabel).map(fromPrototype)
    )

    const contributorRoles = await loadContributorRoles()
    addContainedModels<ContributorRole>(contributorRoles.map(fromPrototype))

    if (template?.styles) {
      for (const id of template.styles.keys()) {
        const style = data.styles.get(id)

        if (style) {
          addContainedModel<Style>(fromPrototype(style))
        }
      }
    } else {
      for (const style of data.styles.values()) {
        addContainedModel<Style>(fromPrototype(style))
      }
    }
  } else {
    const dependencies = await loadBundledDependencies()
    addContainedModels(dependencies.map(fromPrototype))
  }

  const dependencyMap = new Map(dependencies.map((model) => [model._id, model]))

  const newPageLayout = updatedPageLayout(
    dependencyMap as Map<string, StyleObject>,
    template?.pageLayout || DEFAULT_PAGE_LAYOUT
  )

  // const colorScheme = this.findDefaultColorScheme(newStyles)

  manuscript.pageLayout = newPageLayout._id

  // add the citation style bundle(s)
  const [bundle, parentBundle] = await loadBundle(bundleID)
  manuscript.bundle = bundle._id
  addContainedModel<Bundle>(bundle)

  if (parentBundle) {
    addContainedModel<Bundle>(parentBundle)
  }

  if (addContent) {
    // add the template requirements and sections
    const addNewRequirement = async <S extends Requirement>(
      requirementID: string
    ): Promise<S | undefined> => {
      const requirement = data.templatesData.get(requirementID) as S | undefined

      if (requirement) {
        const newRequirement: S = {
          ...fromPrototype(requirement),
          ignored: false,
        }

        addContainedModel<Requirement>(newRequirement)

        return newRequirement
      }
    }

    if (template) {
      // save manuscript requirements
      for (const requirementField of manuscriptCountRequirementFields) {
        const requirementID = template[requirementField]

        if (requirementID) {
          const requirement = await addNewRequirement(requirementID)

          if (requirement) {
            manuscript[requirementField] = requirement._id
          }
        }
      }

      // create new sections
      const sectionDescriptions: SectionDescription[] = []

      if (template.mandatorySectionRequirements) {
        for (const requirementID of template.mandatorySectionRequirements) {
          const requirement = data.templatesData.get(requirementID) as
            | MandatorySubsectionsRequirement
            | undefined

          if (requirement) {
            for (const sectionDescription of requirement.embeddedSectionDescriptions) {
              sectionDescriptions.push(sectionDescription)
            }
          }
        }
      }

      if (sectionDescriptions.length) {
        // create the required sections, if there are any
        const items = createManuscriptSectionsFromTemplate(
          data.templatesData,
          data.sectionCategories,
          sectionDescriptions
        )

        addContainedModels(items)
      } else {
        // create an empty section, if there are no required sections
        const paragraph = createEmptyParagraph(newPageLayout)
        addContainedModel<ParagraphElement>(paragraph)

        addContainedModel<Section>({
          ...buildSection(),
          elementIDs: [paragraph._id],
        })
      }

      // create a cover letter manuscript alongside the _first_ manuscript,
      // if it's a research article or has a cover letter requirement in the template
      // TODO: use section descriptions in the cover-letter category from required sections?
      if (priority === 1) {
        const coverLetterDependencies = buildCoverLetterRequirements({
          data,
          template,
          bundleID: manuscript.bundle,
          containerID,
        })

        for (const coverLetterDependency of coverLetterDependencies) {
          addDependency(coverLetterDependency)
        }
      }
    } else {
      // an empty paragraph for the first section
      const paragraph = createEmptyParagraph(newPageLayout)
      addContainedModel<ParagraphElement>(paragraph)

      // the first section
      addContainedModel<Section>({
        ...buildSection(),
        elementIDs: [paragraph._id],
      })
    }
  }

  // save the manuscript dependencies
  const results = await collection.bulkCreate(dependencies)

  const failures = results.filter(isBulkDocsError)

  if (failures.length) {
    throw new BulkCreateError(failures)
  }

  // save the manuscript
  await collection.create(manuscript, { containerID })

  trackEvent({
    category: 'Manuscripts',
    action: 'Create',
    label: `template=${analyticsTemplateName}`,
  })

  history.push(`/projects/${containerID}/manuscripts/${manuscript._id}`)

  if (newProject) {
    sendNewProjectNotification(containerID)
  }
}

function* buildCoverLetterRequirements({
  bundleID,
  containerID,
  data,
  template,
}: {
  bundleID: string
  containerID: string
  data: SharedData
  template: ManuscriptTemplateData
}) {
  if (
    template.coverLetterRequirement ||
    template.category === RESEARCH_ARTICLE_CATEGORY
  ) {
    const sectionCategory = data.sectionCategories.get(
      COVER_LETTER_SECTION_CATEGORY
    )

    const coverLetterManuscript = buildManuscript(
      sectionCategory ? sectionCategory.name : 'Cover Letter'
    )

    const coverLetterRequirement = template.coverLetterRequirement
      ? (data.manuscriptTemplates.get(template.coverLetterRequirement) as
          | ManuscriptCoverLetterRequirement
          | undefined)
      : undefined

    const placeholder =
      coverLetterRequirement && coverLetterRequirement.placeholderString
        ? coverLetterRequirement.placeholderString
        : COVER_LETTER_PLACEHOLDER

    const paragraph = buildParagraph(placeholder) as ParagraphElement

    yield {
      ...paragraph,
      containerID,
      manuscriptID: coverLetterManuscript._id,
    }

    const section = buildSection(1)
    section.elementIDs = [paragraph._id]
    section.titleSuppressed = true

    yield {
      ...section,
      containerID,
      manuscriptID: coverLetterManuscript._id,
    }

    yield {
      ...coverLetterManuscript,
      bundle: bundleID, // use the same citation style
      category: COVER_LETTER_CATEGORY,
      priority: 2, // the cover letter is always the second manuscript
      containerID,
    }
  }
}
