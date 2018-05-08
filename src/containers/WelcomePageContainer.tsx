import React from 'react'
import { RouterProps } from 'react-router'
import { Redirect } from 'react-router-dom'
import { Main, Page } from '../components/Page'
import { RecentFile, WelcomePage } from '../components/WelcomePage'
import preferences from '../lib/preferences'
import { UserProps, withUser } from '../store/UserProvider'
import SidebarContainer from './SidebarContainer'

type Props = UserProps & RouterProps

class WelcomePageContainer extends React.Component<Props> {
  // TODO: load recent files from the database
  public componentDidMount() {
    const preferencesData = preferences.get()

    if (preferencesData.hideWelcome) {
      this.props.history.push('/')
    }
  }

  public render() {
    const { user } = this.props

    if (!user.data) {
      return <Redirect to={'/login'} />
    }

    return (
      <Page>
        <SidebarContainer />

        <Main>
          <WelcomePage
            createNewManuscript={this.createNewManuscript}
            handleHideWelcomeChange={this.handleHideWelcomeChange}
            openManuscript={this.openManuscript}
            recentFiles={[]}
            sendFeedback={this.sendFeedback}
            handleClose={this.handleClose}
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
    const preferencesData = preferences.get()

    preferencesData.hideWelcome = event.target.checked

    preferences.set(preferencesData)
  }
}

export default withUser(WelcomePageContainer)
