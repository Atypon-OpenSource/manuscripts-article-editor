import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { User } from '../src/components/User'

const user = {
  name: 'Foo',
  surname: 'Bar',
  email: 'foo@example.com',
  tel: '',
  affiliations: [],
}

storiesOf('User', module)
  .add('signed in', () => <User user={user} />)
  .add('signed out', () => <User />)
