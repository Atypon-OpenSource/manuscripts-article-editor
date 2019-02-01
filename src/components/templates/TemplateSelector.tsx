import {
  Build,
  buildContributor,
  buildManuscript,
  buildProject,
  buildSection,
  ContainedModel,
  DEFAULT_BUNDLE,
  generateID,
  isManuscriptModel,
  ManuscriptModel,
  ModelAttachment,
  ObjectType,
} from '@manuscripts/manuscript-editor'
import {
  Bundle,
  Contributor,
  Manuscript,
  ManuscriptCategory,
  Model,
  ParagraphElement,
  Project,
  Section,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import config from '../../config'
import { BulkCreateError } from '../../lib/errors'
import { isManuscript, nextManuscriptPriority } from '../../lib/manuscript'
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
import { Collection, isBulkDocsError } from '../../sync/Collection'
// import { Collection } from '../../sync/Collection'
import CollectionManager from '../../sync/CollectionManager'
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
            importManuscript={this.importManuscript(db)}
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
      const projectsCollection = this.openProjectsCollection()
      await projectsCollection.create(newProject)
    }

    const collection = await this.createProjectCollection(db, projectID)

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

  private createProjectCollection = (db: Database, projectID: string) =>
    CollectionManager.createCollection<ContainedModel | ManuscriptModel>({
      collection: `project-${projectID}`,
      channels: [`${projectID}-read`, `${projectID}-readwrite`],
      db,
    })

  private openProjectsCollection = () =>
    CollectionManager.getCollection<Project>('user' /* 'projects' */)

  // tslint:disable:cyclomatic-complexity
  private selectTemplate = (db: Database) => async (item: TemplateData) => {
    const { templatesData, sectionCategories, manuscriptTemplates } = this.state

    const { handleComplete, history, user } = this.props

    const title = buildManuscriptTitle(item)

    const newProject = this.buildNewProject()

    if (newProject) {
      const projectsCollection = this.openProjectsCollection()
      await projectsCollection.create(newProject)
    }

    const projectID: string = newProject
      ? newProject._id
      : this.props.projectID!

    const bundle = findBundle(item.template)

    const collection = await this.createProjectCollection(db, projectID)

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
          requirement._id = generateID(requirement.objectType as ObjectType)
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

  private importManuscript = (db: Database) => async (models: Model[]) => {
    const {
      handleComplete,
      history,
      user,
      projectID: possibleProjectID,
    } = this.props

    const newProject = possibleProjectID ? null : buildProject(user.userID)

    const projectID = newProject ? newProject._id : possibleProjectID!

    const collection = await this.createProjectCollection(db, projectID)

    if (newProject) {
      const projectsCollection = this.openProjectsCollection()
      await projectsCollection.create(newProject)
    }

    const manuscript = models.find(isManuscript)

    if (!manuscript) {
      throw new Error('No manuscript found')
    }

    manuscript.priority = await nextManuscriptPriority(collection as Collection<
      Manuscript
    >)

    // TODO: save dependencies first, then the manuscript
    // TODO: handle multiple manuscripts in a project bundle

    const items = models.map(model => ({
      ...model,
      containerID: projectID,
      manuscriptID: isManuscriptModel(model) ? manuscript._id : undefined,
    }))

    const results = await collection.bulkCreate(items)

    for (const model of models as Array<Model & ModelAttachment>) {
      if (model.attachment) {
        await collection.attach(model._id, model.attachment)
      }
    }

    const failures = results.filter(isBulkDocsError)

    if (failures.length) {
      throw new BulkCreateError(failures)
    }

    history.push(`/projects/${projectID}/manuscripts/${manuscript._id}`)

    handleComplete()
  }
}

export default withRouter(TemplateSelector)
