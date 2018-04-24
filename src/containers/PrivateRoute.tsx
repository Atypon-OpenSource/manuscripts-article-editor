import * as React from 'react'
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom'
import { Spinner } from '../components/Spinner'
import { UserProviderState, withUser } from '../store/UserProvider'

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any> // tslint:disable-line:no-any
  user: UserProviderState
}

const PrivateRoute: React.SFC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props: RouteComponentProps<{}>) => {
      const { user } = rest

      if (!user.loaded) {
        return <Spinner />
      }

      if (!user.data) {
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

export default withUser(PrivateRoute)
