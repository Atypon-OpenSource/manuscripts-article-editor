import qs from 'qs'
import React from 'react'

import { RouteComponentProps } from 'react-router'
import config from '../../config'
import client from '../../lib/client'
import AlertMessage, { AlertMessageType } from '../AlertMessage'

interface RouteParams {
  sig: string
  sso: string
}

type Props = RouteComponentProps<RouteParams>

interface State {
  loginRedirectURL: string | null
  error: Error | null
}

export class CommunityLoginPageContainer extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = { loginRedirectURL: null, error: null }
  }

  public async componentDidMount() {
    const q = qs.parse(this.props.location.search.substr(1))

    try {
      const resp = await client.get<{ url: string }>(`/auth/discourseLogin`, {
        params: { sso: q.sso, sig: q.sig },
        headers: config.api.headers,
        withCredentials: true,
      })
      window.location.href = resp.data.url
    } catch (e) {
      this.setState({ loginRedirectURL: null, error: e })
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
    } else {
      return (
        <AlertMessage type={AlertMessageType.info}>
          Redirecting to Manuscripts.io community login...
        </AlertMessage>
      )
    }
  }
}

export default CommunityLoginPageContainer
