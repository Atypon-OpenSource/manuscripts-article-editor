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
