import * as React from 'react'
import { connect } from 'react-redux'
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom'
import { Spinner } from '../components/Spinner'
import {
  AuthenticationState,
  AuthenticationStateProps,
} from '../store/authentication/types'
import { ApplicationState } from '../store/types'

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentClass
  authentication: AuthenticationState
}

const PrivateRoute: React.SFC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}: PrivateRouteProps) => (
  <Route
    {...rest}
    render={(props: RouteComponentProps<{}>) => {
      const { authentication } = rest

      if (!authentication.loaded) {
        return <Spinner />
      }

      if (!authentication.user) {
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }

      return <Component {...props} />
    }}
  />
)

export default connect<AuthenticationStateProps>((state: ApplicationState) => ({
  authentication: state.authentication,
}))(PrivateRoute)
