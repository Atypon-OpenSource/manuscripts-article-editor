import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'

export const RequireLogin: React.FunctionComponent<RouteComponentProps> = ({
  children: message,
  location: from,
}) => (
  <Redirect
    to={{
      pathname: '/login',
      state: { from, message },
    }}
  />
)
