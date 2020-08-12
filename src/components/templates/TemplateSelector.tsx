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
  buildContributor,
  buildManuscript,
  buildParagraph,
  buildProject,
  buildSection,
  ContainedModel,
  DEFAULT_BUNDLE,
  ManuscriptModel,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  Contributor,
  ContributorRole,
  MandatorySubsectionsRequirement,
  Manuscript,
  ManuscriptCategory,
  ManuscriptCoverLetterRequirement,
  ManuscriptTemplate,
  Model,
  ObjectTypes,
  ParagraphElement,
  Project,
  Publisher,
  ResearchField,
  Section,
  SectionCategory,
  SectionDescription,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useHistory } from 'react-router-dom'
import { nextManuscriptPriority } from '../../lib/manuscript'
import { postWebkitMessage } from '../../lib/native'
import { manuscriptCountRequirementFields } from '../../lib/requirements'
import { loadSharedData } from '../../lib/shared-data'
import {
  attachStyle,
  buildCategories,
  buildItems,
  buildResearchFields,
  chooseBundleID,
  COVER_LETTER_CATEGORY,
  COVER_LETTER_PLACEHOLDER,
  COVER_LETTER_SECTION_CATEGORY,
  createEmptyParagraph,
  createManuscriptSectionsFromTemplate,
  createMergedTemplate,
  createNewBundle,
  createNewBundledStyles,
  createNewContributorRoles,
  createNewTemplateStyles,
  createParentBundle,
  fromPrototype,
  RESEARCH_ARTICLE_CATEGORY,
  updatedPageLayout,
} from '../../lib/templates'
import { trackEvent } from '../../lib/tracking'
import { Collection } from '../../sync/Collection'
import CollectionManager from '../../sync/CollectionManager'
import {
  Requirement,
  TemplateData,
  TemplatesDataType,
} from '../../types/templates'
import { DatabaseContext } from '../DatabaseProvider'
import {
  createProjectCollection,
  importManuscript,
  openProjectsCollection,
} from '../projects/ImportManuscript'
import { PseudoProjectPage } from './PseudoProjectPage'
import { TemplateLoadingModal } from './TemplateLoadingModal'
import { TemplateSelectorModal } from './TemplateSelectorModal'

export interface SharedData {
  bundles: Map<string, Bundle>
  contributorRoles: Map<string, ContributorRole>
  manuscriptCategories: Map<string, ManuscriptCategory>
  manuscriptTemplates: Map<string, ManuscriptTemplate>
  publishers: Map<string, Publisher>
  researchFields: Map<string, ResearchField>
  sectionCategories: Map<string, SectionCategory>
  styles: Map<string, Model>
  templatesData: Map<string, TemplatesDataType>
  userManuscriptTemplates: Map<string, ManuscriptTemplate>
}

const buildNewProject = ({
  projectID,
  user,
}: {
  projectID?: string
  user: UserProfile
}): Build<Project> | undefined => {
  return projectID ? undefined : buildProject(user.userID)
}

// private findDefaultColorScheme = (newStyles: Map<string, Model>) => {
//   for (const style of newStyles.values()) {
//     if (isColorScheme(style)) {
//       if (style.prototype === DEFAULT_COLOR_SCHEME) {
//         return style
//       }
//     }
//   }
// }

const sendNewProjectNotification = (projectID: string) => {
  postWebkitMessage('action', {
    name: 'assign-project',
    projectID,
  })
}

export interface TemplateSelectorProps {
  handleComplete: (isCancellation?: boolean) => void
  user: UserProfile
  projectID?: string
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  handleComplete,
  projectID,
  user,
}) => {
  const db = useContext(DatabaseContext)

  const [data, setData] = useState<SharedData>()

  const history = useHistory()

  const handleCancellation = useCallback(() => {
    handleComplete(true)
  }, [handleComplete])

  const [userTemplates, setUserTemplates] = useState<ManuscriptTemplate[]>()

  const [userTemplateModels, setUserTemplateModels] = useState<
    ManuscriptModel[]
  >()

  useEffect(() => {
    const loadUserTemplates = async () => {
      const projects = await CollectionManager.getCollection('user')
        .find({
          objectType: ObjectTypes.Project,
          templateContainer: true,
        })
        .exec()
        .then(docs => docs.map(doc => doc.toJSON()) as Project[])

      const syncedProjectCollections = (projects: Project[]) =>
        Promise.all<Collection<ContainedModel>>(
          projects.map(
            project =>
              new Promise(async resolve => {
                const collection = await CollectionManager.createCollection<
                  ContainedModel
                >({
                  collection: `project-${project._id}`,
                  channels: [`${project._id}-read`, `${project._id}-readwrite`],
                  db,
                })

                if (collection.status.pull.complete) {
                  resolve(collection)
                }

                collection.addEventListener('complete', async event => {
                  if (event.detail.direction === 'pull' && event.detail.value) {
                    resolve(collection)
                  }
                })
              })
          )
        )

      const collections = await syncedProjectCollections(projects)

      const userTemplates: ManuscriptTemplate[] = []
      const userTemplateModels: ManuscriptModel[] = []

      for (const collection of collections) {
        const templates = await collection
          .find({ objectType: ObjectTypes.ManuscriptTemplate })
          .exec()
          .then(docs => docs.map(doc => doc.toJSON()) as ManuscriptTemplate[])

        const models = await collection
          .find({
            templateID: {
              $in: templates.map(template => template._id),
            },
          })
          .exec()
          .then(docs => docs.map(doc => doc.toJSON()) as ManuscriptModel[])

        // TODO: stop syncing the collection now?

        userTemplates.push(...templates)
        userTemplateModels.push(...models)
      }

      setUserTemplates(userTemplates)
      setUserTemplateModels(userTemplateModels)
    }

    loadUserTemplates().catch(error => {
      // TODO: display error message
      console.error(error) // tslint:disable-line:no-console
    })
  }, [])

  useEffect(() => {
    if (userTemplates && userTemplateModels) {
      loadSharedData(userTemplates, userTemplateModels)
        .then(setData)
        .catch(error => {
          // TODO: display error message
          console.error(error) // tslint:disable-line:no-console
        })
    }
  }, [userTemplates, userTemplateModels])

  const importManuscriptModels = useMemo(
    () => importManuscript(db, history, user, handleComplete, projectID),
    [db, history, user, handleComplete, projectID]
  )

  const categories = useMemo(
    () => (data ? buildCategories(data.manuscriptCategories) : undefined),
    [data]
  )

  const researchFields = useMemo(
    () => (data ? buildResearchFields(data.researchFields) : undefined),
    [data]
  )

  const items = useMemo(() => (data ? buildItems(data) : undefined), [data])

  // TODO: refactor most of this to a separate module
  // tslint:disable-next-line:cyclomatic-complexity
  const createEmpty = useCallback(async () => {
    if (!data) {
      throw new Error('Data not loaded')
    }

    const newProject = projectID ? null : buildProject(user.userID)

    const containerID = newProject ? newProject._id : projectID!

    if (newProject) {
      const projectsCollection = openProjectsCollection()
      await projectsCollection.create(newProject)
    }

    const collection = await createProjectCollection(db, containerID)

    const priority = await nextManuscriptPriority(
      collection as Collection<Manuscript>
    )

    const newBundle = createNewBundle(DEFAULT_BUNDLE, data.bundles)

    const newStyles = createNewBundledStyles(data.styles)

    const newContributorRoles = createNewContributorRoles(data.contributorRoles)

    const newPageLayout = updatedPageLayout(newStyles)

    // const colorScheme = this.findDefaultColorScheme(newStyles)

    const manuscript = {
      ...buildManuscript(),
      bundle: newBundle._id,
      pageLayout: newPageLayout._id,
      // colorScheme: colorScheme ? colorScheme._id : DEFAULT_COLOR_SCHEME,
      priority,
    }

    const contributor = buildContributor(
      user.bibliographicName,
      'author',
      0,
      user.userID
    )

    const saveContainedModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID,
      })

    const saveManuscriptModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID,
        manuscriptID: manuscript._id,
      })

    await saveContainedModel<Bundle>(newBundle)
    await attachStyle(newBundle, collection)

    const parentBundle = createParentBundle(newBundle, data.bundles)

    if (parentBundle) {
      await saveContainedModel<Bundle>(parentBundle)
      await attachStyle(parentBundle, collection)
    }

    for (const newStyle of newStyles.values()) {
      await saveManuscriptModel<Model>(newStyle)
    }

    for (const newContributorRole of newContributorRoles.values()) {
      await saveManuscriptModel<ContributorRole>(newContributorRole)
    }

    await saveManuscriptModel<Contributor>(contributor)

    const paragraph = createEmptyParagraph(newPageLayout)

    await saveManuscriptModel<ParagraphElement>(paragraph)

    await saveManuscriptModel<Section>({
      ...buildSection(),
      elementIDs: [paragraph._id],
    })

    await saveContainedModel<Manuscript>(manuscript)

    trackEvent({
      category: 'Manuscripts',
      action: 'Create',
      label: `template=(empty)`,
    })

    history.push(`/projects/${containerID}/manuscripts/${manuscript._id}`)

    if (newProject) {
      sendNewProjectNotification(containerID)
    }

    handleComplete()
  }, [handleComplete, data])

  // TODO: refactor most of this to a separate module
  const selectTemplate = useCallback(
    // tslint:disable-next-line:cyclomatic-complexity
    async (item: TemplateData) => {
      if (!data) {
        throw new Error('Data not loaded')
      }

      const newProject = buildNewProject({ projectID, user })

      if (newProject) {
        const projectsCollection = openProjectsCollection()
        await projectsCollection.create(newProject)
        try {
          // try to ensure that the collection syncs
          await projectsCollection.ensurePushSync()
        } catch (error) {
          // continue anyway
          // tslint:disable-next-line:no-console
          console.error(error, 'Unable to ensure push sync of new project')
        }
      }

      const containerID: string = newProject ? newProject._id : projectID!

      const newBundle = createNewBundle(chooseBundleID(item), data.bundles)

      const collection = await createProjectCollection(db, containerID)

      const priority = newProject
        ? 1
        : await nextManuscriptPriority(collection as Collection<Manuscript>)

      // merge the templates
      const mergedTemplate = item.template
        ? createMergedTemplate(item.template, data.manuscriptTemplates)
        : undefined

      const newStyles =
        mergedTemplate && mergedTemplate.styles
          ? createNewTemplateStyles(
              data.styles,
              Object.keys(mergedTemplate.styles)
            )
          : createNewBundledStyles(data.styles)

      const newPageLayout = updatedPageLayout(newStyles, mergedTemplate)

      const newContributorRoles = createNewContributorRoles(
        data.contributorRoles
      )

      // const colorScheme = this.findDefaultColorScheme(newStyles)

      const manuscript: Build<Manuscript> = {
        ...buildManuscript(),
        bundle: newBundle._id,
        pageLayout: newPageLayout._id,
        priority,
        // colorScheme: colorScheme ? colorScheme._id : DEFAULT_COLOR_SCHEME,
      }

      // TODO: Make sure this manuscript is associated with the template

      const saveContainedModel = <T extends Model>(data: Build<T>) =>
        collection.create(data, {
          containerID,
        })

      const saveManuscriptModel = <T extends Model>(data: Build<T>) =>
        collection.create(data, {
          containerID,
          manuscriptID: manuscript._id,
        })

      await saveContainedModel<Bundle>(newBundle)
      await attachStyle(newBundle, collection)

      const parentBundle = createParentBundle(newBundle, data.bundles)

      if (parentBundle) {
        await saveContainedModel<Bundle>(parentBundle)
        await attachStyle(parentBundle, collection)
      }

      for (const newStyle of newStyles.values()) {
        await saveManuscriptModel<Model>(newStyle)
      }

      for (const newContributorRole of newContributorRoles.values()) {
        await saveManuscriptModel<ContributorRole>(newContributorRole)
      }

      const contributor = buildContributor(
        user.bibliographicName,
        'author',
        0,
        user.userID
      )

      await saveManuscriptModel<Contributor>(contributor)

      const addNewRequirement = async <S extends Requirement>(
        requirementID: string
      ): Promise<S | undefined> => {
        const requirement = data.templatesData.get(requirementID) as
          | S
          | undefined

        if (requirement) {
          const newRequirement: S = {
            ...fromPrototype(requirement),
            ignored: false,
          }

          await saveManuscriptModel<Requirement>(newRequirement)

          return newRequirement
        }
      }

      if (mergedTemplate) {
        // save manuscript requirements
        for (const requirementField of manuscriptCountRequirementFields) {
          const requirementID = mergedTemplate[requirementField]

          if (requirementID) {
            const requirement = await addNewRequirement(requirementID)

            if (requirement) {
              manuscript[requirementField] = requirement._id
            }
          }
        }

        // create new sections
        const sectionDescriptions: SectionDescription[] = []

        if (mergedTemplate.mandatorySectionRequirements) {
          for (const requirementID of mergedTemplate.mandatorySectionRequirements) {
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

          for (const item of items) {
            await saveManuscriptModel(item)
          }
        } else {
          // create an empty section, if there are no required sections
          const paragraph = createEmptyParagraph(newPageLayout)

          await saveManuscriptModel<ParagraphElement>(paragraph)

          await saveManuscriptModel<Section>({
            ...buildSection(),
            elementIDs: [paragraph._id],
          })
        }

        // create a cover letter manuscript alongside the _first_ manuscript,
        // if it's a research article or has a cover letter requirement in the template
        // TODO: use section descriptions in the cover-letter category from required sections?
        if (priority === 1) {
          if (
            mergedTemplate.coverLetterRequirement ||
            mergedTemplate.category === RESEARCH_ARTICLE_CATEGORY
          ) {
            const sectionCategory = data.sectionCategories.get(
              COVER_LETTER_SECTION_CATEGORY
            )

            const coverLetterManuscript = buildManuscript(
              sectionCategory ? sectionCategory.name : 'Cover Letter'
            )

            const coverLetterRequirement = mergedTemplate.coverLetterRequirement
              ? (data.manuscriptTemplates.get(
                  mergedTemplate.coverLetterRequirement
                ) as ManuscriptCoverLetterRequirement | undefined)
              : undefined

            const placeholder =
              coverLetterRequirement && coverLetterRequirement.placeholderString
                ? coverLetterRequirement.placeholderString
                : COVER_LETTER_PLACEHOLDER

            const paragraph = buildParagraph(placeholder) as ParagraphElement

            await collection.create(paragraph, {
              containerID,
              manuscriptID: coverLetterManuscript._id,
            })

            const section = buildSection(1)
            section.elementIDs = [paragraph._id]
            section.titleSuppressed = true

            await collection.create(section, {
              containerID,
              manuscriptID: coverLetterManuscript._id,
            })

            await saveContainedModel<Manuscript>({
              ...coverLetterManuscript,
              bundle: newBundle._id,
              category: COVER_LETTER_CATEGORY,
              priority: 2, // the cover letter is always the second manuscript
            })
          }
        }

        // await saveContainedModel(mergedTemplate) // TODO: should the template be saved?
      }

      // save the manuscript
      await saveContainedModel<Manuscript>(manuscript)

      trackEvent({
        category: 'Manuscripts',
        action: 'Create',
        label: `template=${item.title}`,
      })

      history.push(`/projects/${containerID}/manuscripts/${manuscript._id}`)

      if (newProject) {
        sendNewProjectNotification(containerID)
      }

      handleComplete()
    },
    [handleComplete, history, data, user]
  )

  if (!data || !categories || !researchFields || !items) {
    return (
      <TemplateLoadingModal
        handleCancel={handleCancellation}
        status={'Thinking…'}
      />
    )
  }

  return (
    <>
      {!projectID && <PseudoProjectPage />}

      <TemplateSelectorModal
        categories={categories}
        createEmpty={createEmpty}
        handleComplete={handleCancellation}
        importManuscript={importManuscriptModels}
        items={items}
        researchFields={researchFields}
        selectTemplate={selectTemplate}
      />
    </>
  )
}

export default TemplateSelector
