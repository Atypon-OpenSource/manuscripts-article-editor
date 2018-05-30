import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  Dropdown,
  DropdownContainer,
  DropdownToggle,
} from '../src/components/Dropdown'
import { UserInfo } from '../src/components/UserInfo'
import { user } from './data/contributors'

storiesOf('Dropdown', module).add('Menu', () => (
  <DropdownContainer>
    <span>Menu</span>
    <DropdownToggle onClick={action('toggle')}>▼</DropdownToggle>
    <Dropdown>
      <UserInfo user={user} />
    </Dropdown>
  </DropdownContainer>
))
