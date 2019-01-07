import {
  Build,
  buildContributor,
  buildManuscript,
  buildProject,
  DEFAULT_BUNDLE,
} from '@manuscripts/manuscript-editor'
import {
  Bundle,
  ManuscriptCategory,
  Model,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { History } from 'history'
import React from 'react'
import config from '../../config'
import { ContributorRole } from '../../lib/roles'
import {
  buildCategories,
  buildItems,
  buildManuscriptTitle,
  buildResearchFields,
  categoriseSectionRequirements,
  createEmptyManuscriptSections,
  createExtraManuscripts,
  createManuscriptSectionsFromTemplate,
  fetchSharedData,
  findBundle,
  prepareRequirements,
  saveCategory,
  saveParentTemplates,
  saveTemplate,
} from '../../lib/templates'
import { ModelIDs } from '../../store/ModelsProvider'
import {
  ManuscriptTemplate,
  Publisher,
  ResearchField,
  SectionCategory,
  TemplateData,
  TemplatesDataType,
} from '../../types/templates'
import { Category, Dialog } from '../Dialog'
import { ProgressModal } from '../projects/ProgressModal'
import { TemplateSelectorModal } from './TemplateSelectorModal'

interface Props {
  handleComplete: () => void
  user: UserProfile
  projectID?: string
  saveModel: <T extends Model>(model: Build<T>, ids: ModelIDs) => Promise<T>
  history: History
}

interface State {
  error?: Error
  bundles?: Map<string, Bundle>
  loading?: string
  manuscriptCategories?: Map<string, ManuscriptCategory>
  sectionCategories?: Map<string, SectionCategory>
  manuscriptTemplates?: Map<string, ManuscriptTemplate>
  publishers?: Map<string, Publisher>
  templatesData?: Map<string, TemplatesDataType>
  researchFields?: Map<string, ResearchField>
}

export class TemplateSelector extends React.Component<Props, State> {
  public state: Readonly<State> = {}

  public async componentDidMount() {
    this.loadData().catch(error => {
      this.setState({ error })
    })
  }

  public render() {
    const {
      bundles,
      error,
      loading,
      manuscriptCategories,
      manuscriptTemplates,
      publishers,
      researchFields,
    } = this.state

    if (error) {
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
      <TemplateSelectorModal
        categories={buildCategories(manuscriptCategories)}
        researchFields={buildResearchFields(researchFields)}
        createEmpty={this.createEmpty}
        handleComplete={this.props.handleComplete}
        items={buildItems(manuscriptTemplates, bundles, publishers)}
        selectTemplate={this.selectTemplate}
        projectID={this.props.projectID}
      />
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

  private createEmpty = async () => {
    const {
      handleComplete,
      history,
      user,
      projectID: possibleProjectID,
    } = this.props

    const newProject = possibleProjectID ? null : buildProject(user.userID)

    const projectID = newProject
      ? newProject._id
      : (possibleProjectID as string)

    const manuscript = {
      ...buildManuscript(undefined),
      bundle: DEFAULT_BUNDLE,
    }

    const manuscriptID = manuscript._id

    const saveModelWithIDs = this.saveModelWithIDs({
      projectID,
      manuscriptID,
    })

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    if (newProject) {
      await this.props.saveModel(newProject, {})
    }

    await saveModelWithIDs(contributor)
    await saveModelWithIDs(manuscript)

    // TODO: copy CSL file, more shared data?

    history.push(`/projects/${projectID}/manuscripts/${manuscriptID}`)

    handleComplete()
  }

  private saveModelWithIDs = (ids: ModelIDs) => (model: Build<Model>) =>
    this.props.saveModel(model, ids)

  private buildNewProject = () => {
    const { projectID, user } = this.props

    return projectID ? undefined : buildProject(user.userID)
  }

  private selectTemplate = async (item: TemplateData) => {
    const {
      templatesData,
      manuscriptCategories,
      sectionCategories,
      manuscriptTemplates,
    } = this.state

    const { handleComplete, history, user, saveModel } = this.props

    const title = buildManuscriptTitle(item)

    const newProject = this.buildNewProject()

    const projectID: string = newProject
      ? newProject._id
      : this.props.projectID!

    const bundle = findBundle(item.template)

    const manuscript = {
      ...buildManuscript(title),
      bundle,
    }

    const manuscriptID = manuscript._id

    const saveModelWithIDs = this.saveModelWithIDs({
      projectID,
      manuscriptID,
    })

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    if (newProject) {
      await this.props.saveModel(newProject, {})
    }

    await saveModelWithIDs(contributor)

    // save the bundle
    if (item.bundle) {
      await this.props.saveModel(item.bundle, {})
    }

    if (item.template) {
      const requirements = prepareRequirements(item.template, templatesData)

      await Promise.all(requirements.map(saveModelWithIDs))

      const {
        requiredSections,
        manuscriptSections,
      } = categoriseSectionRequirements(requirements)

      if (requiredSections.length && sectionCategories) {
        await createManuscriptSectionsFromTemplate(
          requiredSections,
          sectionCategories,
          saveModelWithIDs
        )
      } else {
        await createEmptyManuscriptSections(saveModelWithIDs)
      }

      // save the category
      await saveCategory(item.template, saveModelWithIDs, manuscriptCategories)

      // save the template
      await saveTemplate(item.template, saveModelWithIDs, manuscriptTemplates)

      // TODO: build/use the requirements object or merged template instead of dealing with parent templates?

      // save the parent templates
      await saveParentTemplates(
        item.template,
        saveModelWithIDs,
        manuscriptTemplates
      )

      // save any extra manuscript
      await createExtraManuscripts(
        manuscriptSections,
        saveModel,
        projectID,
        item.template
      )
    }

    await saveModelWithIDs(manuscript)

    // TODO: copy CSL file, more shared data?

    history.push(`/projects/${projectID}/manuscripts/${manuscriptID}`)

    handleComplete()
  }
}
