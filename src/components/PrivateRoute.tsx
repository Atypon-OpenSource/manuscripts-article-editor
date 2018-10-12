import React from 'react'
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom'
import { UserProps, withUser } from '../store/UserProvider'
import { Spinner } from './Spinner'

interface Props {
  component: React.ComponentType<any> // tslint:disable-line:no-any
  message?: string
}

const PrivateRoute: React.SFC<Props & RouteProps & UserProps> = ({
  component: Component,
  message,
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
              state: {
                from: props.location,
                loginMessage: message,
              },
            }}
          />
        )
      }

      return <Component {...props} />
    }}
  />
)

export default withUser<Props & RouteProps>(PrivateRoute)
