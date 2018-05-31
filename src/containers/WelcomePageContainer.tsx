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
import { AnyComponent, UserProfile } from '../types/components'

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
          />
        </Main>
      </Page>
    )
  }

  private getCollection() {
    return this.props.components.collection as RxCollection<AnyComponent>
  }

  private createNewManuscript = async () => {
    // TODO: open up the template modal

    const user = this.props.user.data as UserProfile

    const owner = user.id.replace('|', '_')

    const collection = this.getCollection()

    const project = buildProject(owner)
    await collection.insert(project)

    const manuscript = buildManuscript(project.id, owner)
    const contributor = buildContributor(user)

    await this.props.components.saveComponent(manuscript.id, contributor)
    await this.props.components.saveComponent(manuscript.id, manuscript)

    this.props.history.push(
      `/projects/${project.id}/manuscripts/${manuscript.id}`
    )
  }

  private sendFeedback = () => {
    // TODO
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
