import { storiesOf } from '@storybook/react'
import React from 'react'
import { UserInfo } from '../src/components/nav/UserInfo'
import { UserMenu } from '../src/components/nav/UserMenu'
import { user } from './data/contributors'

storiesOf('Nav/User', module)
  .add('UserInfo', () => <UserInfo user={user} />)
  .add('UserMenu', () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: 400 }}>
      <UserMenu user={user} />
    </div>
  ))
