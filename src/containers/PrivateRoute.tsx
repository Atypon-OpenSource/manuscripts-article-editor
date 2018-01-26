import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps } from 'react-router-dom'
import { Spinner } from '../components/Spinner'
import { AuthenticationState, State } from '../types'

interface PrivateRouteProps {
  component: React.ComponentClass
}

const PrivateRoute: React.SFC<PrivateRouteProps & AuthenticationState> = ({
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props: RouteComponentProps<{}> & AuthenticationState) => {
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

export default connect((state: State) => ({
  authentication: state.authentication,
}))(PrivateRoute)
