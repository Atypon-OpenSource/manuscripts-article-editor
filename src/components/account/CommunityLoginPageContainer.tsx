import qs from 'qs'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import config from '../../config'
import client from '../../lib/client'
import AlertMessage, { AlertMessageType } from '../AlertMessage'

type Props = RouteComponentProps<{
  sig: string
  sso: string
}>

interface State {
  error?: Error
}

export class CommunityLoginPageContainer extends React.Component<Props, State> {
  public state: Readonly<State> = {}

  public async componentDidMount() {
    const { sso, sig } = qs.parse(this.props.location.search.substr(1))

    try {
      const resp = await client.get<{ url: string }>('/auth/discourseLogin', {
        params: { sso, sig },
        headers: config.api.headers,
        withCredentials: true,
      })
      window.location.href = resp.data.url
    } catch (error) {
      this.setState({ error })
    }
  }

  public render = () => {
    if (this.state.error) {
      return (
        <React.Fragment>
          <h1>Failed to log in to Manuscripts.io community.</h1>
          <AlertMessage type={AlertMessageType.error}>
            {this.state.error.message}
          </AlertMessage>
        </React.Fragment>
      )
    }

    return (
      <AlertMessage type={AlertMessageType.info}>
        Redirecting to Manuscripts.io community login...
      </AlertMessage>
    )
  }
}

export default CommunityLoginPageContainer
