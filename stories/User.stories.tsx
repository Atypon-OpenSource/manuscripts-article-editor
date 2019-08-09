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

import { storiesOf } from '@storybook/react'
import React from 'react'
import { ProfileDropdown } from '../src/components/nav/ProfileDropdown'
import { UserInfo } from '../src/components/nav/UserInfo'
import { user } from './data/contributors'

storiesOf('Nav/User', module)
  .add('UserInfo', () => <UserInfo user={user} />)
  .add('ProfileDropdown', () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: 400 }}>
      <ProfileDropdown user={user} />
    </div>
  ))
