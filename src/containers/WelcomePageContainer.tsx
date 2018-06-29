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
import { ComponentsProps, withComponents } from '../store/ComponentsProvider'
import { UserProps, withUser } from '../store/UserProvider'
import { generateID } from '../transformer/id'
import * as ObjectTypes from '../transformer/object-types'
import { AnyComponent, Manuscript, UserProfile } from '../types/components'
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
    return this.props.components.collection as RxCollection<AnyComponent>
  }

  private createProject = async (owner: string) => {
    const project = buildProject(owner)

    await this.getCollection().insert(project)

    return project
  }

  private createNewManuscript = async () => {
    // TODO: open up the template modal
    const user = this.props.user.data as UserProfile
    const owner = user.userID

    const project = await this.createProject(owner)

    const contributor = buildContributor(user)
    const manuscript = buildManuscript(project.id, owner)

    await this.props.components.saveComponent(manuscript.id, contributor)
    await this.props.components.saveComponent(manuscript.id, manuscript)

    this.props.history.push(
      `/projects/${project.id}/manuscripts/${manuscript.id}`
    )
  }

  private importManuscript: ImportManuscript = async components => {
    const user = this.props.user.data as UserProfile
    const owner = user.userID

    const project = await this.createProject(owner)

    const id = generateID('manuscript') as string

    const setManuscriptProperties = (manuscript: Manuscript) => {
      manuscript.id = id
      manuscript.project = project.id
      manuscript.owners = [owner]
    }

    for (const component of components) {
      if (component.objectType === ObjectTypes.MANUSCRIPT) {
        setManuscriptProperties(component as Manuscript)
      }

      await this.props.components.saveComponent(id, component)
    }

    this.props.history.push(`/projects/${project.id}/manuscripts/${id}`)
  }

  private sendFeedback = () => {
    window.open('mailto:support@manuscriptsapp.com', '_blank')
  }

  private handleClose = () => {
    this.props.history.push('/')
  }

  private openManuscript = (file: RecentFile) => {
    this.props.history.push(`/projects/${file.project}/manuscripts/${file.id}`)
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
