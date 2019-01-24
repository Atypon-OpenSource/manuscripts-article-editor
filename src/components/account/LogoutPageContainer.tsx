import React from 'react'
import { RouteComponentProps } from 'react-router'
import { TokenActions } from '../../data/TokenData'
import { logout } from '../../lib/account'
import AlertMessage, { AlertMessageType } from '../AlertMessage'
import { DatabaseProps, withDatabase } from '../DatabaseProvider'
import { Main, Page } from '../Page'

interface Props {
  tokenActions: TokenActions
}

interface State {
  error: Error | null
}

class LogoutPageContainer extends React.Component<
  Props & DatabaseProps & RouteComponentProps,
  State
> {
  public state: Readonly<State> = {
    error: null,
  }

  public async componentDidMount() {
    try {
      await logout(this.props.db)

      this.props.tokenActions.delete()

      // this.props.history.push('/')
      window.location.href = '/login#action=logout'
    } catch (error) {
      this.setState({ error })
    }
  }

  public render() {
    const { error } = this.state

    return (
      <Page>
        <Main>
          {error && (
            <AlertMessage type={AlertMessageType.error}>
              {error.message}
            </AlertMessage>
          )}
        </Main>
      </Page>
    )
  }
}

export default withDatabase<Props>(LogoutPageContainer)
