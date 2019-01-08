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
