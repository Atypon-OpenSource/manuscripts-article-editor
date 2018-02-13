import * as React from 'react'
import { connect } from 'react-redux'
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom'
import { Spinner } from '../components/Spinner'
import { AuthenticationStateProps } from '../store/authentication/types'
import { ApplicationState } from '../store/types'

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentClass
}

const PrivateRoute: React.SFC<PrivateRouteProps & AuthenticationStateProps> = ({
  component: Component,
  ...rest
}: PrivateRouteProps) => (
  <Route
    {...rest}
    render={(props: RouteComponentProps<{}> & AuthenticationStateProps) => {
      const { authentication } = props

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
