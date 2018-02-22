import * as React from 'react'

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { User } from '../src/components/User'
import { styled } from '../src/theme'

import * as avatar from './assets/melnitz.jpg'

const user = {
  name: 'Foo',
  surname: 'Bar',
  email: 'foo@example.com',
  tel: '',
  affiliations: [],
}

const userWithAvatar = {
  ...user,
  avatar,
}

const Container = styled.div`
  width: 300px;
  background-color: rgba(145, 196, 255, 0.12);
`

storiesOf('User', module)
  .add('closed', () => (
    <Container>
      <User user={user} isOpen={false} toggleOpen={action('toggle')} />
    </Container>
  ))
  .add('open', () => (
    <Container>
      <User user={user} isOpen={true} toggleOpen={action('toggle')} />
    </Container>
  ))
  .add('with avatar', () => (
    <Container>
      <User
        user={userWithAvatar}
        isOpen={false}
        toggleOpen={action('toggle')}
      />
    </Container>
  ))
