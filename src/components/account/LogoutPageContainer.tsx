import React from 'react'
import { RouteComponentProps } from 'react-router'
import { logout } from '../../lib/account'
import { databaseCreator } from '../../lib/db'
import AlertMessage from '../AlertMessage'
import { Main, Page } from '../Page'

interface State {
  error: string | null
}

class LogoutPageContainer extends React.Component<RouteComponentProps, State> {
  public state: Readonly<State> = {
    error: null,
  }

  public async componentDidMount() {
    try {
      const db = await databaseCreator
      await logout(db)
    } catch (error) {
      this.setState({ error })
    }

    // this.props.history.push('/')
    window.location.href = '/'
  }

  public render() {
    const { error } = this.state

    return (
      <Page>
        <Main>
          {error ? (
            <AlertMessage type={'error'}>{error}</AlertMessage>
          ) : (
            <div>Signing out…</div>
          )}
        </Main>
      </Page>
    )
  }
}

export default LogoutPageContainer
