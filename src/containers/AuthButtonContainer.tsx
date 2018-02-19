import { stringify } from 'qs'
import * as React from 'react'
import { AuthenticationButtonProps } from '../components/Authentication'

const apiBaseUrl: string = String(process.env.API_BASE_URL)

type Provider = 'google' | 'orcid'

interface AuthButtonContainerProps {
  component: React.SFC<AuthenticationButtonProps>
}

class AuthButtonContainer extends React.Component<AuthButtonContainerProps> {
  public render() {
    const { component: Component } = this.props

    return <Component redirect={this.redirect} />
  }

  private redirect = (provider: Provider) => () => {
    window.location.href = apiBaseUrl + 'authorize?' + stringify({ provider })
  }
}

export default AuthButtonContainer
