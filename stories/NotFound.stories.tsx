import { storiesOf } from '@storybook/react'
import createBrowserHistory from 'history/createBrowserHistory'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import NotFoundPage from '../src/components/NotFoundPage'

const routeProps: RouteComponentProps = {
  history: createBrowserHistory(),
  match: {
    isExact: true,
    params: {},
    path: '',
    url: '',
  },
  location: {
    hash: '',
    pathname: '/page-that-does-not-exist',
    search: '',
    state: {},
  },
}

storiesOf('NotFound', module).add('Resource not found', () => (
  <NotFoundPage {...routeProps} />
))
