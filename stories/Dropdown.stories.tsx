import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  Dropdown,
  DropdownButton,
  DropdownContainer,
} from '../src/components/nav/Dropdown'
import { UserInfo } from '../src/components/nav/UserInfo'
import { user } from './data/contributors'

storiesOf('Nav/Dropdown', module)
  .add('Menu', () => (
    <DropdownContainer>
      <DropdownButton isOpen={false} onClick={action('toggle')}>
        Menu
      </DropdownButton>
      <Dropdown>
        <UserInfo user={user} />
      </Dropdown>
    </DropdownContainer>
  ))
  .add('Button', () => (
    <div>
      <DropdownButton isOpen={false}>Closed</DropdownButton>
      <DropdownButton isOpen={true}>Open</DropdownButton>
      <DropdownButton isOpen={false} notificationsCount={3}>
        Closed with notifications
      </DropdownButton>
      <DropdownButton isOpen={true} notificationsCount={3}>
        Open with notifications
      </DropdownButton>
      <DropdownButton isOpen={false} notificationsCount={30}>
        More notifications
      </DropdownButton>
      <DropdownButton isOpen={false} notificationsCount={300}>
        More notifications
      </DropdownButton>
      <DropdownButton isOpen={false} notificationsCount={3000}>
        More notifications
      </DropdownButton>
    </div>
  ))
