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

import { ProjectsDropdownList } from '../src/components/nav/ProjectsDropdownList'
import invitationsData from './data/invitations-data'
import projects from './data/projects'

storiesOf('Nav/Projects Dropdown List', module)
  .add('Without projects', () => (
    <ProjectsDropdownList
      projects={[]}
      invitationsData={[]}
      acceptedInvitations={[]}
      rejectedInvitations={[]}
      acceptInvitation={action('accept invitation')}
      addProject={action('add project')}
      acceptError={null}
      confirmReject={action('show dialog to confirm invitation rejection')}
    />
  ))
  .add('With projects', () => (
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
  ))
  .add('With only invitations', () => (
    <ProjectsDropdownList
      projects={[]}
      invitationsData={invitationsData}
      acceptedInvitations={[
        'ProjectInvitation|2da9a8bc004083daea2b2746a5414b18f318f845',
      ]}
      rejectedInvitations={[]}
      acceptInvitation={action('accept invitation')}
      addProject={action('add project')}
      acceptError={null}
      confirmReject={action('show dialog to confirm invitation rejection')}
    />
  ))
  .add('With projects and invitations', () => (
    <ProjectsDropdownList
      projects={projects}
      invitationsData={invitationsData}
      acceptedInvitations={[
        'ProjectInvitation|2da9a8bc004083daea2b2746a5414b18f318f845',
      ]}
      rejectedInvitations={[]}
      acceptInvitation={action('accept invitation')}
      addProject={action('add project')}
      acceptError={null}
      confirmReject={action('show dialog to confirm invitation rejection')}
    />
  ))
  .add('With rejected invitations', () => (
    <ProjectsDropdownList
      projects={projects}
      invitationsData={invitationsData}
      acceptedInvitations={[
        'ProjectInvitation|2da9a8bc004083daea2b2746a5414b18f318f845',
      ]}
      rejectedInvitations={[
        'ProjectInvitation|2da9a8bc004083daea2b2746a5414b18f318f547',
      ]}
      acceptInvitation={action('accept invitation')}
      addProject={action('add project')}
      acceptError={null}
      confirmReject={action('show dialog to confirm invitation rejection')}
    />
  ))
