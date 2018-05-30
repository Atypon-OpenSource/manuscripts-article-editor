import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router-dom'
import { Main, Page } from '../components/Page'
import { Spinner } from '../components/Spinner'
import { RecentFile, WelcomePage } from '../components/WelcomePage'
import preferences, { Preferences } from '../lib/preferences'
import { UserProps, withUser } from '../store/UserProvider'

interface State {
  preferences: Preferences
}

class WelcomePageContainer extends React.Component<
  UserProps & RouteComponentProps<{}>,
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

  private createNewManuscript = () => {
    // TODO: open up the template modal
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

export default withUser(WelcomePageContainer)
