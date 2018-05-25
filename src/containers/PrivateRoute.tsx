import React from 'react'
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom'
import { Spinner } from '../components/Spinner'
import { UserProps, withUser } from '../store/UserProvider'

interface Props {
  component: React.ComponentType<any> // tslint:disable-line:no-any
}

const PrivateRoute: React.SFC<Props & RouteProps & UserProps> = ({
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props: RouteComponentProps<{}>) => {
      const { user } = rest

      if (!user.loaded) {
        return <Spinner color={'black'} />
      }

      if (user.error) {
        return <Spinner color={'red'} />
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

export default withUser<Props & RouteProps>(PrivateRoute)
