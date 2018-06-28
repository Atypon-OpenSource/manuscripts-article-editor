import { stringify } from 'qs'
import React from 'react'
import { AuthenticationButtonProps } from '../components/Authentication'
import config from '../config'
import deviceId from '../lib/deviceId'

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
      ...config.api.headers,
    }

    window.location.href =
      config.api.url + '/auth/' + provider + '?' + stringify(params)
  }
}

export default AuthButtonContainer
