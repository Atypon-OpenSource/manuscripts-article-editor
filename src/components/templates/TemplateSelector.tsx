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
  buildContributor,
  buildManuscript,
  buildProject,
  buildSection,
  DEFAULT_BUNDLE,
  generateID,
} from '@manuscripts/manuscript-transform'
import {
  Bundle,
  Contributor,
  Manuscript,
  ManuscriptCategory,
  Model,
  ObjectTypes,
  ParagraphElement,
  Project,
  Section,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import config from '../../config'
import { nextManuscriptPriority } from '../../lib/manuscript'
import { ContributorRole } from '../../lib/roles'
import {
  buildCategories,
  buildItems,
  buildManuscriptTitle,
  buildResearchFields,
  buildSectionFromDescription,
  categoriseSectionRequirements,
  chooseSectionTitle,
  createEmptyParagraph,
  createManuscriptSectionsFromTemplate,
  createMergedTemplate,
  fetchSharedData,
  findBundle,
  prepareRequirements,
} from '../../lib/templates'
import { Collection } from '../../sync/Collection'
import {
  ManuscriptTemplate,
  Publisher,
  RequirementType,
  ResearchField,
  SectionCategory,
  TemplateData,
  TemplatesDataType,
} from '../../types/templates'
import { Database, DatabaseContext } from '../DatabaseProvider'
import { Category, Dialog } from '../Dialog'
import {
  createProjectCollection,
  importManuscript,
  openProjectsCollection,
} from '../projects/ImportManuscript'
import { ProgressModal } from '../projects/ProgressModal'
import { TemplateSelectorModal } from './TemplateSelectorModal'

interface Props {
  handleComplete: () => void
  user: UserProfile
  projectID?: string
}

interface State {
  loadingError?: Error
  bundles?: Map<string, Bundle>
  loading?: string
  manuscriptCategories?: Map<string, ManuscriptCategory>
  sectionCategories?: Map<string, SectionCategory>
  manuscriptTemplates?: Map<string, ManuscriptTemplate>
  publishers?: Map<string, Publisher>
  templatesData?: Map<string, TemplatesDataType>
  researchFields?: Map<string, ResearchField>
}

class TemplateSelector extends React.Component<
  Props & RouteComponentProps,
  State
> {
  public state: Readonly<State> = {}

  public async componentDidMount() {
    this.loadData().catch(loadingError => {
      this.setState({ loadingError })
    })
  }

  public render() {
    const {
      bundles,
      loadingError,
      loading,
      manuscriptCategories,
      manuscriptTemplates,
      publishers,
      researchFields,
    } = this.state

    const { history, handleComplete, user, projectID } = this.props

    if (loadingError) {
      return (
        <Dialog
          isOpen={true}
          category={Category.error}
          header={'Error'}
          message={`There was an error loading the templates. Please contact ${
            config.support.email
          } if this persists.`}
          actions={{
            primary: {
              action: this.props.handleComplete,
              title: 'OK',
            },
          }}
        />
      )
    }

    if (
      !manuscriptTemplates ||
      !manuscriptCategories ||
      !bundles ||
      !publishers ||
      !researchFields
    ) {
      return (
        <ProgressModal
          canCancel={true}
          handleCancel={this.props.handleComplete}
          status={`Loading ${loading}…`}
        />
      )
    }

    return (
      <DatabaseContext.Consumer>
        {db => (
          <TemplateSelectorModal
            categories={buildCategories(manuscriptCategories)}
            researchFields={buildResearchFields(researchFields)}
            createEmpty={this.createEmpty(db)}
            importManuscript={importManuscript(
              db,
              history,
              user,
              handleComplete,
              projectID
            )}
            handleComplete={this.props.handleComplete}
            items={buildItems(manuscriptTemplates, bundles, publishers)}
            selectTemplate={this.selectTemplate(db)}
            projectID={this.props.projectID}
          />
        )}
      </DatabaseContext.Consumer>
    )
  }

  private async loadData() {
    this.setState({ loading: 'categories' })

    const manuscriptCategories = await fetchSharedData<ManuscriptCategory>(
      'manuscript-categories'
    )

    const sectionCategories = await fetchSharedData<SectionCategory>(
      'section-categories'
    )

    this.setState({ loading: 'publishers' })

    const publishers = await fetchSharedData<Publisher>('publishers')

    this.setState({ loading: 'fields' })

    const keywords = await fetchSharedData<ResearchField>('keywords')

    const researchFields = new Map<string, ResearchField>()

    for (const item of keywords.values()) {
      if (item.objectType === 'MPResearchField') {
        researchFields.set(item._id, item)
      }
    }

    this.setState({ loading: 'styles' })

    const bundles = await fetchSharedData<Bundle>('bundles')

    this.setState({ loading: 'templates' })

    const templatesData = await fetchSharedData<TemplatesDataType>(
      'templates-v2'
    )

    const manuscriptTemplates = new Map<string, ManuscriptTemplate>()

    for (const item of templatesData.values()) {
      if (item.objectType === 'MPManuscriptTemplate') {
        manuscriptTemplates.set(item._id, item as ManuscriptTemplate)
      }
    }

    this.setState({
      bundles,
      manuscriptCategories,
      sectionCategories,
      manuscriptTemplates,
      publishers,
      templatesData,
      researchFields,
      loading: undefined,
    })
  }

  private createEmpty = (db: Database) => async () => {
    const {
      handleComplete,
      history,
      user,
      projectID: possibleProjectID,
    } = this.props

    const newProject = possibleProjectID ? null : buildProject(user.userID)

    const projectID = newProject ? newProject._id : possibleProjectID!

    if (newProject) {
      const projectsCollection = openProjectsCollection()
      await projectsCollection.create(newProject)
    }

    const collection = await createProjectCollection(db, projectID)

    const priority = await nextManuscriptPriority(collection as Collection<
      Manuscript
    >)

    const manuscript = {
      ...buildManuscript(undefined),
      bundle: DEFAULT_BUNDLE,
      priority,
    }

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    const saveContainedModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID: projectID,
      })

    const saveManuscriptModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID: projectID,
        manuscriptID: manuscript._id,
      })

    await saveManuscriptModel<Contributor>(contributor)
    await saveContainedModel<Manuscript>(manuscript)

    history.push(`/projects/${projectID}/manuscripts/${manuscript._id}`)

    handleComplete()
  }

  private buildNewProject = (): Build<Project> | undefined => {
    const { projectID, user } = this.props

    return projectID ? undefined : buildProject(user.userID)
  }

  // tslint:disable:cyclomatic-complexity
  private selectTemplate = (db: Database) => async (item: TemplateData) => {
    const { templatesData, sectionCategories, manuscriptTemplates } = this.state

    const { handleComplete, history, user } = this.props

    const title = buildManuscriptTitle(item)

    const newProject = this.buildNewProject()

    if (newProject) {
      const projectsCollection = openProjectsCollection()
      await projectsCollection.create(newProject)
    }

    const projectID: string = newProject
      ? newProject._id
      : this.props.projectID!

    const bundle = findBundle(item.template)

    const collection = await createProjectCollection(db, projectID)

    let priority = await nextManuscriptPriority(collection as Collection<
      Manuscript
    >)

    const manuscript: Build<Manuscript> = {
      ...buildManuscript(title),
      bundle,
      priority: priority++,
    }

    const saveContainedModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID: projectID,
      })

    const saveManuscriptModel = <T extends Model>(data: Build<T>) =>
      collection.create(data, {
        containerID: projectID,
        manuscriptID: manuscript._id,
      })

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    await saveManuscriptModel<Contributor>(contributor)

    if (item.template) {
      // merge the templates
      const mergedTemplate = createMergedTemplate(
        item.template,
        manuscriptTemplates
      )

      // save the requirements
      // TODO: build a new requirements object and save it to the template, or re-use the existing one?

      const requirements = prepareRequirements(mergedTemplate, templatesData)

      mergedTemplate.requirementIDs = await Promise.all(
        requirements.map(async requirement => {
          requirement._id = generateID(requirement.objectType as ObjectTypes)
          await saveManuscriptModel<RequirementType>(requirement)
          return requirement._id
        })
      )

      const {
        requiredSections,
        manuscriptSections,
      } = categoriseSectionRequirements(requirements)

      if (requiredSections.length && sectionCategories) {
        const items = createManuscriptSectionsFromTemplate(
          requiredSections,
          sectionCategories
        )

        for (const item of items) {
          await saveManuscriptModel(item)
        }
      } else {
        const paragraph = createEmptyParagraph()

        await saveManuscriptModel<ParagraphElement>(paragraph)

        await saveManuscriptModel<Section>({
          ...buildSection(),
          elementIDs: [paragraph._id],
        })
      }

      await saveManuscriptModel(mergedTemplate)

      // save any extra manuscripts
      for (const sectionDescription of manuscriptSections) {
        const sectionCategory = sectionCategories!.get(
          sectionDescription.sectionCategory
        )

        const manuscriptTitle = chooseSectionTitle(
          sectionDescription,
          sectionCategory
        )

        const extraManuscript = buildManuscript(manuscriptTitle)

        const containerIDs = {
          containerID: projectID,
          manuscriptID: extraManuscript._id,
        }

        const { section, dependencies } = buildSectionFromDescription(
          sectionDescription,
          1,
          sectionCategory
        )

        for (const dependency of dependencies) {
          await collection.save(dependency, containerIDs)
        }

        await collection.save(section, containerIDs)

        await saveContainedModel<Manuscript>({
          ...extraManuscript,
          bundle,
          priority: priority++,
        })
      }
    }

    // save the manuscript
    await saveContainedModel<Manuscript>(manuscript)

    // NOTE: not saving the shared data to the project

    history.push(`/projects/${projectID}/manuscripts/${manuscript._id}`)

    handleComplete()
  }
}

export default withRouter(TemplateSelector)
