/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  Dropdown,
  DropdownButton,
  DropdownContainer,
} from '../src/components/nav/Dropdown'
import { ProjectsDropdown } from '../src/components/nav/ProjectsDropdown'
import { ProjectsDropdownList } from '../src/components/nav/ProjectsDropdownList'
import { UserInfo } from '../src/components/nav/UserInfo'
import { user } from './data/contributors'
import projects from './data/projects'

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
  .add('Menu - Projects Dropdown', () => (
    <ProjectsDropdown notificationsCount={0}>
      <ProjectsDropdownList
        projects={projects}
        invitationsData={[]}
        acceptedInvitations={[]}
        rejectedInvitations={[]}
        acceptInvitation={action('accept invitation')}
        addProject={action('add project')}
        acceptError={null}
        confirmReject={action('show dialog to confirm invitation rejection')}
      />
    </ProjectsDropdown>
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
      <DropdownButton isOpen={false} removeChevron={true}>
        Without Chevron
      </DropdownButton>
    </div>
  ))
