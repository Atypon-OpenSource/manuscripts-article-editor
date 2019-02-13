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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-editor'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import ProjectsMenu from '../src/components/nav/ProjectsMenu'
import { EmptyProjectPage } from '../src/components/projects/EmptyProjectPage'
import ManuscriptSidebar from '../src/components/projects/ManuscriptSidebar'
import { ProjectsList } from '../src/components/projects/ProjectsList'
import { user } from './data/contributors'
import manuscripts from './data/manuscripts'
import { people } from './data/people'
import projects from './data/projects'

const users: Map<string, UserProfileWithAvatar> = new Map()

for (const person of people) {
  users.set(person._id, person)
}

storiesOf('Projects', module)
  .add('Projects Page', () => (
    <ProjectsList
      projects={projects}
      collaborators={users}
      deleteProject={action('delete project')}
      saveProjectTitle={action('save project title')}
      user={user}
      acceptedInvitations={[]}
    />
  ))
  .add('Projects Page - Empty', () => (
    <EmptyProjectPage
      project={projects[0]}
      openTemplateSelector={action('open template selector ')}
    />
  ))
  .add('Manuscript Sidebar', () => (
    <ManuscriptSidebar
      openTemplateSelector={action('open')}
      manuscript={manuscripts[0]}
      manuscripts={manuscripts}
      project={projects[0]}
      saveProjectTitle={action('save title')}
      selected={null}
      user={user}
    />
  ))
  .add('Projects Menu', () => (
    <ProjectsMenu
      invitationsData={[]}
      removeInvitationData={action('remove')}
      projects={projects}
      acceptedInvitations={[]}
      rejectedInvitations={[]}
      acceptError={null}
      acceptInvitation={action('accept invitation')}
      confirmReject={action('show dialog to confirm invitation rejection')}
      user={user}
    />
  ))
