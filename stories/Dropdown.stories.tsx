/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
