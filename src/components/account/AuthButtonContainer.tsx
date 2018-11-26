import { stringify } from 'qs'
import React from 'react'
import config from '../../config'
import deviceId from '../../lib/deviceId'
import { AuthenticationButtonProps } from './Authentication'

export type AuthProvider = 'google' | 'orcid'

interface Props {
  component: React.FunctionComponent<AuthenticationButtonProps>
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
