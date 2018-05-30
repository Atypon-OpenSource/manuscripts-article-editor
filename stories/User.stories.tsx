import { storiesOf } from '@storybook/react'
import React from 'react'
import { UserInfo } from '../src/components/UserInfo'
import { UserMenu } from '../src/components/UserMenu'
import { user } from './data/contributors'

storiesOf('User', module)
  .add('UserInfo', () => <UserInfo user={user} />)
  .add('UserMenu', () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: 400 }}>
      <UserMenu user={user} />
    </div>
  ))
