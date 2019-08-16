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
import AddCollaboratorButton from '../src/components/collaboration/AddCollaboratorButton'
import CollaboratorSettingsButton from '../src/components/collaboration/CollaboratorSettingsButton'
import InvitedCollaboratorSettingsButton from '../src/components/collaboration/InvitedCollaboratorSettingsButton'
import InviteAuthorButton from '../src/components/metadata/InviteAuthorButton'
import { authors } from './data/contributors'
import { invitations } from './data/invitations-data'
import { people } from './data/people'
import { project } from './data/projects'

storiesOf('Collaboration/Popper Buttons', module)
  .add('CollaboratorSettingsButton', () => (
    <CollaboratorSettingsButton
      project={project}
      collaborator={people[0]}
      updateUserRole={action('update role')}
      openPopper={action('open popper')}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  ))
  .add('InvitedCollaboratorSettingsButton', () => (
    <InvitedCollaboratorSettingsButton
      invitation={invitations[0]}
      openPopper={action('open popper')}
      projectInvite={action('project invite')}
      projectUninvite={action('project uninvite')}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  ))
  .add('AddCollaboratorButton', () => (
    <AddCollaboratorButton
      collaborator={people[0]}
      countAddedCollaborators={action('count collaborators')}
      addCollaborator={action('add collaborator')}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  ))

storiesOf('Metadata/Popper Buttons', module).add('InviteAuthorButton', () => (
  <InviteAuthorButton
    author={authors[0]}
    project={project}
    updateAuthor={action('update author')}
    tokenActions={{
      delete: action('delete token'),
      update: action('update token'),
    }}
  />
))
