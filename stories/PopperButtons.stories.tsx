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
    />
  ))
  .add('InvitedCollaboratorSettingsButton', () => (
    <InvitedCollaboratorSettingsButton
      invitation={invitations[0]}
      openPopper={action('open popper')}
      projectInvite={action('project invite')}
      projectUninvite={action('project uninvite')}
    />
  ))
  .add('AddCollaboratorButton', () => (
    <AddCollaboratorButton
      collaborator={people[0]}
      countAddedCollaborators={action('count collaborators')}
      addCollaborator={action('add collaborator')}
    />
  ))

storiesOf('Metadata/Popper Buttons', module).add('InviteAuthorButton', () => (
  <InviteAuthorButton
    author={authors[0]}
    project={project}
    updateAuthor={action('update author')}
  />
))
