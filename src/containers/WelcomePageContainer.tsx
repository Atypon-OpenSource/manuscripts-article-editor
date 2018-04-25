import * as React from 'react'
import { RouterProps } from 'react-router'
import { Redirect } from 'react-router-dom'
import { WelcomePage } from '../components/WelcomePage'
import preferences from '../lib/preferences'
import { UserProps, withUser } from '../store/UserProvider'

class WelcomePageContainer extends React.Component<UserProps & RouterProps> {
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
      <WelcomePage
        createNewManuscript={this.createNewManuscript}
        handleHideWelcomeChange={this.handleHideWelcomeChange}
        openManuscript={this.openManuscript}
        recentFiles={[]}
        sendFeedback={this.sendFeedback}
        handleClose={this.handleClose}
      />
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

  private openManuscript = (id: string) => {
    this.props.history.push(`/manuscripts/${id}`)
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
