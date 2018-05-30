import { stringify } from 'qs'
import React from 'react'
import { AuthenticationButtonProps } from '../components/Authentication'
import deviceId from '../lib/deviceId'
import { applicationHeaders } from '../lib/headers'

const apiBaseUrl: string = String(process.env.API_BASE_URL)

export type AuthProvider = 'google' | 'orcid'

interface Props {
  component: React.SFC<AuthenticationButtonProps>
}

class AuthButtonContainer extends React.Component<Props> {
  public render() {
    const { component: Component } = this.props

    return <Component redirect={this.redirect} />
  }

  private redirect = (provider: AuthProvider) => () => {
    const params = {
      deviceId,
      ...applicationHeaders,
    }

    window.location.href =
      apiBaseUrl + '/auth/' + provider + '?' + stringify(params)
  }
}

export default AuthButtonContainer
