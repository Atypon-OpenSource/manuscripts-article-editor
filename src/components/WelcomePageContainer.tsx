import {
  buildContributor,
  buildManuscript,
  buildProject,
  generateID,
  ModelAttachment,
  timestamp,
} from '@manuscripts/manuscript-editor'
import {
  Model,
  ObjectTypes,
  Project,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router-dom'
import { RxCollection } from 'rxdb'
import config from '../config'
import preferences, { Preferences } from '../lib/preferences'
import { ContributorRole } from '../lib/roles'
import sessionID from '../lib/sessionID'
import { ModelsProps, withModels } from '../store/ModelsProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { Main, Page } from './Page'
import { Spinner } from './Spinner'
import { RecentFile, WelcomePage } from './WelcomePage'

interface State {
  preferences: Preferences
}

class WelcomePageContainer extends React.Component<
  ModelsProps & UserProps & RouteComponentProps<{}>,
  State
> {
  public state = {
    preferences: preferences.get(),
  }

  // TODO: load recent files from the database
  public componentDidMount() {
    if (this.state.preferences.hideWelcome) {
      this.props.history.push('/')
    }
  }

  public render() {
    const { user } = this.props

    if (!user.loaded) {
      return <Spinner />
    }

    if (!user.data) {
      return <Redirect to={'/login'} />
    }

    return (
      <Page>
        <Main>
          <WelcomePage
            createNewManuscript={this.createNewManuscript}
            handleHideWelcomeChange={this.handleHideWelcomeChange}
            openManuscript={this.openManuscript}
            recentFiles={[]}
            sendFeedback={this.sendFeedback}
            handleClose={this.handleClose}
            hideWelcome={this.state.preferences.hideWelcome}
            importManuscript={this.importManuscript}
          />
        </Main>
      </Page>
    )
  }

  private getCollection() {
    return this.props.models.collection as RxCollection<{}>
  }

  private createProject = async (owner: string) => {
    const project = buildProject(owner) as Project

    const now = timestamp()
    project.createdAt = now
    project.updatedAt = now
    project.sessionID = sessionID

    await this.getCollection().insert(project)

    return project
  }

  private createNewManuscript = async () => {
    // TODO: open up the template modal
    const user = this.props.user.data as UserProfile
    const owner = user.userID

    const project = await this.createProject(owner)
    const projectID = project._id

    const manuscript = buildManuscript()
    const manuscriptID = manuscript._id

    const contributor = buildContributor(
      user.bibliographicName,
      ContributorRole.author,
      0,
      user.userID
    )

    await this.props.models.saveModel(contributor, {
      projectID,
      manuscriptID,
    })

    await this.props.models.saveModel(manuscript, {
      projectID,
      manuscriptID,
    })

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private importManuscript = async (models: Model[]): Promise<void> => {
    const user = this.props.user.data as UserProfile
    const owner = user.userID

    const project = await this.createProject(owner)
    const projectID = project._id

    const manuscriptID = generateID(ObjectTypes.Manuscript)

    for (const model of models) {
      if (model.objectType === ObjectTypes.Manuscript) {
        model._id = manuscriptID
      }

      const { attachment, ...data } = model as Model & ModelAttachment

      // TODO: save dependencies first

      const result = await this.props.models.saveModel(data, {
        manuscriptID,
        projectID,
      })

      if (attachment) {
        await this.props.models.putAttachment(result._id, attachment)
      }
    }

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private sendFeedback = () => {
    window.open(`mailto:${config.support.email}`, '_blank')
  }

  private handleClose = () => {
    this.props.history.push('/')
  }

  private openManuscript = (file: RecentFile) => {
    this.props.history.push(
      `/projects/${file.containerID}/manuscripts/${file.id}`
    )
  }

  private handleHideWelcomeChange: React.ChangeEventHandler<
    HTMLInputElement
  > = event => {
    const data = {
      ...this.state.preferences,
      hideWelcome: !event.target.checked,
    }

    preferences.set(data)

    this.setState({
      preferences: data,
    })
  }
}

export default withModels(withUser(WelcomePageContainer))
