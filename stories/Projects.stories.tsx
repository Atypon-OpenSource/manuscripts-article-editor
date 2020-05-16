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

import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import ProjectsMenu from '../src/components/nav/ProjectsMenu'
import { EmptyProjectPage } from '../src/components/projects/EmptyProjectPage'
import ManuscriptSidebar from '../src/components/projects/ManuscriptSidebar'
// import { ProjectsList } from '../src/components/projects/ProjectsList'
import { user } from './data/contributors'
import manuscripts from './data/manuscripts'
import { people } from './data/people'
import projects from './data/projects'

const users: Map<string, UserProfileWithAvatar> = new Map()

for (const person of people) {
  users.set(person._id, person)
}

storiesOf('Projects', module)
  /*.add('Projects Page', () => (
    <ProjectsList
      projects={projects}
      deleteProject={action('delete project')}
      saveProjectTitle={action('save project title')}
      user={user}
      acceptedInvitations={[]}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  ))*/
  .add('Projects Page - Empty', () => (
    <EmptyProjectPage
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
      permissions={{
        write: true,
      }}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
      saveModel={action('save model')}
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
