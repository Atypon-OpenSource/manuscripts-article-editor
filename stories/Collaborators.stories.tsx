import { UserProfile } from '@manuscripts/manuscripts-json-schema'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import AddCollaboratorPopper from '../src/components/collaboration/AddCollaboratorPopper'
import AddCollaboratorsSidebar from '../src/components/collaboration/AddCollaboratorsSidebar'
import { CollaboratorForm } from '../src/components/collaboration/CollaboratorForm'
import CollaboratorSettingsPopper from '../src/components/collaboration/CollaboratorSettingsPopper'
import {
  AddCollaboratorsPage,
  CollaboratorDetailsPage,
  InviteCollaboratorsPage,
  SearchCollaboratorsPage,
} from '../src/components/collaboration/CollaboratorsPage'
import CollaboratorsSidebar from '../src/components/collaboration/CollaboratorsSidebar'
import { InvitationForm } from '../src/components/collaboration/InvitationForm'
import InviteCollaboratorPopper from '../src/components/collaboration/InviteCollaboratorPopper'
import InviteCollaboratorsSidebar from '../src/components/collaboration/InviteCollaboratorsSidebar'
import { styled } from '../src/theme'
import { user } from './data/contributors'
import { invitations } from './data/invitations-data'
import { people } from './data/people'
import { project } from './data/projects'

const PopperStory = styled.div`
  width: 300px;
`

storiesOf('Collaboration/Poppers', module)
  .add('Add', () => (
    <PopperStory>
      <AddCollaboratorPopper addCollaborator={action('add collaborator')} />
    </PopperStory>
  ))
  .add('Settings and Remove', () => (
    <PopperStory>
      <CollaboratorSettingsPopper
        project={project}
        collaborator={user}
        handleUpdateRole={action('update role')}
        handleRemove={action('remove')}
        handleOpenModal={action('open update role confirmation modal')}
        updateRoleIsOpen={false}
      />
    </PopperStory>
  ))
  .add('Invite and Uninvite', () => (
    <PopperStory>
      <InviteCollaboratorPopper
        invitation={invitations[0]}
        handleUpdateRole={action('invite')}
        handleUninvite={action('uninvite')}
        handleOpenModal={action('open update role confirmation modal')}
        updateRoleIsOpen={false}
        resendInvitation={action('re-send invitation')}
      />
    </PopperStory>
  ))

storiesOf('Collaboration/Forms', module).add('Invite', () => (
  <PopperStory>
    <InvitationForm allowSubmit={true} handleSubmit={action('submit')} />
  </PopperStory>
))

storiesOf('Collaboration/Pages', module)
  .add('No collaborators', () => (
    <CollaboratorDetailsPage
      project={project}
      collaboratorsCount={0}
      user={user}
      handleAddCollaborator={action('add collaborator')}
      selectedCollaborator={null}
      manageProfile={action('manage your profile')}
    />
  ))
  .add('Collaborator details', () => (
    <CollaboratorDetailsPage
      project={project}
      collaboratorsCount={3}
      user={user}
      handleAddCollaborator={action('add collaborator')}
      selectedCollaborator={null}
      manageProfile={action('manage your profile')}
    />
  ))
  .add('Collaborator Details page', () => (
    <CollaboratorForm
      collaborator={
        // tslint:disable-next-line:no-object-literal-type-assertion
        {
          bibliographicName: {
            _id: 'id',
            objectType: 'MPBibliographicName',
            given: 'Mark',
            family: 'Foobarovic',
          },
        } as UserProfile
      }
      user={user}
      manageProfile={action('manage your profile')}
      affiliations={null}
    />
  ))
  .add('Add collaborators', () => (
    <AddCollaboratorsPage project={project} addedCollaboratorsCount={3} />
  ))
  .add('Invite collaborators', () => (
    <InviteCollaboratorsPage project={project} />
  ))
  .add('Search collaborators by name', () => (
    <SearchCollaboratorsPage project={project} searchText={'bob'} />
  ))
  .add('Search collaborators by email', () => (
    <SearchCollaboratorsPage project={project} searchText={'bob@example.com'} />
  ))

storiesOf('Collaboration/Sidebars', module)
  .add('Collaborators - Owner', () => (
    <CollaboratorsSidebar
      project={{
        ...project,
        owners: [people[0].userID],
        viewers: [people[1].userID, people[2].userID],
      }}
      collaborators={people}
      invitations={invitations}
      user={people[0]}
      projectInvite={action('invitation send')}
      projectUninvite={action('invitation deleted')}
      updateUserRole={action('update user role')}
      handleAddCollaborator={action('add collaborator')}
      handleClickCollaborator={action('selected collaborator')}
    />
  ))
  .add('Collaborators - Non-owner', () => (
    <CollaboratorsSidebar
      project={{
        ...project,
        owners: [people[1].userID],
        viewers: [people[0].userID, people[2].userID],
      }}
      collaborators={people}
      invitations={[]}
      user={people[0]}
      projectInvite={action('invitation send')}
      projectUninvite={action('invitation deleted')}
      updateUserRole={action('update user role')}
      handleAddCollaborator={action('add collaborator')}
      handleClickCollaborator={action('selected collaborator')}
    />
  ))
  .add('Add Collaborator', () => (
    <AddCollaboratorsSidebar
      people={people}
      invitations={[]}
      addCollaborator={action('add collaborator')}
      handleInvite={action('invite')}
      numberOfAddedCollaborators={0}
      countAddedCollaborators={() => 0}
      addedUsers={[]}
      setSearchText={action('set search text')}
      handleDoneCancel={action('handle done/cancel')}
    />
  ))
  .add('Invite Collaborators', () => (
    <InviteCollaboratorsSidebar
      invitationValues={{ name: '', email: 'user@example.com', role: '' }}
      handleCancel={action('cancel')}
      handleSubmit={action('submit')}
    />
  ))
