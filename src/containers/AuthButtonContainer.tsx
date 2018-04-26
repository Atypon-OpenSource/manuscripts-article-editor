import { stringify } from 'qs'
import * as React from 'react'
import { AuthenticationButtonProps } from '../components/Authentication'
import deviceId from '../lib/deviceId'

const apiBaseUrl: string = String(process.env.API_BASE_URL)

export type AuthProvider = 'google' | 'orcid'

interface AuthButtonContainerProps {
  component: React.SFC<AuthenticationButtonProps>
}

class AuthButtonContainer extends React.Component<AuthButtonContainerProps> {
  public render() {
    const { component: Component } = this.props

    return <Component redirect={this.redirect} />
  }

  private redirect = (provider: AuthProvider) => () => {
    const params = {
      deviceId,
      'manuscripts-app-id': process.env.API_APPLICATION_ID,
    }

    window.location.href =
      apiBaseUrl + '/auth/' + provider + '?' + stringify(params)
  }
}

export default AuthButtonContainer
