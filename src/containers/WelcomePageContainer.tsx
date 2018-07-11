import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router-dom'
import { RxCollection } from 'rxdb'
import { Main, Page } from '../components/Page'
import { Spinner } from '../components/Spinner'
import { RecentFile, WelcomePage } from '../components/WelcomePage'
import {
  buildContributor,
  buildManuscript,
  buildProject,
} from '../lib/commands'
import preferences, { Preferences } from '../lib/preferences'
import sessionID from '../lib/sessionID'
import timestamp from '../lib/timestamp'
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { generateID } from '../transformer/id'
import * as ObjectTypes from '../transformer/object-types'
import { Project, UserProfile } from '../types/components'
import { ImportManuscript } from '../types/manuscript'

interface State {
  preferences: Preferences
}

class WelcomePageContainer extends React.Component<
  ComponentsProps & UserProps & RouteComponentProps<{}>,
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
    return this.props.components.collection as RxCollection<{}>
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
    const projectID = project.id

    const manuscript = buildManuscript()
    const manuscriptID = manuscript.id

    const contributor = buildContributor(user.bibliographicName)

    await this.props.components.saveComponent(contributor, {
      projectID,
      manuscriptID,
    })

    await this.props.components.saveComponent(manuscript, {
      projectID,
      manuscriptID,
    })

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private importManuscript: ImportManuscript = async components => {
    const user = this.props.user.data as UserProfile
    const owner = user.userID

    const project = await this.createProject(owner)
    const projectID = project.id

    const manuscriptID = generateID('manuscript') as string

    for (const component of components) {
      if (component.objectType === ObjectTypes.MANUSCRIPT) {
        component.id = manuscriptID
      }

      await this.props.components.saveComponent(component, {
        manuscriptID,
        projectID,
      })
    }

    this.props.history.push(
      `/projects/${projectID}/manuscripts/${manuscriptID}`
    )
  }

  private sendFeedback = () => {
    window.open('mailto:support@manuscriptsapp.com', '_blank')
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

export default withComponents(withUser(WelcomePageContainer))
