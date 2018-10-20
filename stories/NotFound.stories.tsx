import { storiesOf } from '@storybook/react'
import React from 'react'
import NotFound from '../src/components/NotFound'

storiesOf('NotFound', module).add('Resource not found', () => (
  <NotFound
    // tslint:disable-next-line:no-any
    match={{} as any}
    location={{
      pathname: '/page-that-does-not-exist',
      search: '',
      hash: '#hello',
      state: {},
    }}
    // tslint:disable-next-line:no-any
    history={{} as any}
  />
))
