import * as React from 'react'
import { connect } from 'react-redux'
import { AuthenticationButtonProps } from '../components/Authentication'
import { authenticate } from '../store/authentication'
import { AuthenticationDispatchProps } from '../store/authentication/types'

const apiBaseUrl: string = String(process.env.API_BASE_URL)

interface ComponentProps {
  component: React.SFC<AuthenticationButtonProps>
}

class AuthButtonContainer extends React.Component<
  ComponentProps & AuthenticationDispatchProps
> {
  public render() {
    const { component: Component } = this.props

    return <Component openWindow={this.openWindow} />
  }

  private openWindow = (provider: string) => {
    const width = 800
    const height = 400
    const left = window.screenX + (window.outerWidth - width) / 2
    const right = window.screenY + (window.outerHeight - height) / 2.5

    window.open(
      apiBaseUrl + '/authentication/' + provider,
      'oauth',
      `width=${width},height=${height},left=${left},right=${right}`
    )

    const receiveMessage = (event: MessageEvent) => {
      if (!apiBaseUrl.startsWith(event.origin)) {
        return
      }

      if (!event.data.token) {
        return
      }

      window.localStorage.setItem('token', event.data.token)

      window.removeEventListener('message', receiveMessage)

      /* tslint:disable-next-line:no-any */
      this.props.dispatch<any>(authenticate())
    }

    window.addEventListener('message', receiveMessage)
  }
}

export default connect()(AuthButtonContainer)
