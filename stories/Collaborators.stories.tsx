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

import { Affiliation, UserProfile } from '@manuscripts/manuscripts-json-schema'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'
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
import { RemoveCollaboratorPopper } from '../src/components/collaboration/RemoveCollaboratorPopper'
import SearchCollaboratorsSidebar from '../src/components/collaboration/SearchCollaboratorsSidebar'
import { UninviteCollaboratorPopper } from '../src/components/collaboration/UninviteCollaboratorPopper'
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
        project={{ ...project, owners: [user.userID, 'User_foobar'] }}
        collaborator={user}
        handleUpdateRole={action('update role')}
        handleRemove={action('remove')}
        handleOpenModal={action('open update role confirmation modal')}
        updateRoleIsOpen={false}
      />
    </PopperStory>
  ))
  .add('Settings and Remove - only owner', () => (
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
  .add('Settings and Remove - Update role', () => (
    <PopperStory>
      <CollaboratorSettingsPopper
        project={project}
        collaborator={user}
        handleUpdateRole={action('update role')}
        handleRemove={action('remove')}
        handleOpenModal={action('open update role confirmation modal')}
        updateRoleIsOpen={true}
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
        isUpdateRoleOpen={false}
        resendInvitation={action('re-send invitation')}
        resendSucceed={null}
      />
    </PopperStory>
  ))

  .add('Invite and Uninvite - Update role', () => (
    <PopperStory>
      <InviteCollaboratorPopper
        invitation={invitations[0]}
        handleUpdateRole={action('invite')}
        handleUninvite={action('uninvite')}
        handleOpenModal={action('open update role confirmation modal')}
        isUpdateRoleOpen={true}
        resendInvitation={action('re-send invitation')}
        resendSucceed={null}
      />
    </PopperStory>
  ))

storiesOf('Collaboration/Forms', module).add('Invite', () => (
  <PopperStory>
    <InvitationForm
      allowSubmit={true}
      handleSubmit={action('submit')}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  </PopperStory>
))

// tslint:disable-next-line:no-object-literal-type-assertion
const collaborator = {
  bibliographicName: {
    _id: 'id',
    objectType: 'MPBibliographicName',
    given: 'Mark',
    family: 'Foobarovic',
  },
} as UserProfile

storiesOf('Collaboration/Pages', module)
  .add('No collaborators', () => (
    <CollaboratorDetailsPage
      project={project}
      collaboratorsCount={0}
      user={user}
      selectedCollaborator={null}
      handleAddCollaborator={action('add collaborator')}
      manageProfile={action('manage your profile')}
    />
  ))
  .add('Collaborator details', () => (
    <CollaboratorDetailsPage
      project={project}
      collaboratorsCount={3}
      user={user}
      selectedCollaborator={null}
      handleAddCollaborator={action('add collaborator')}
      manageProfile={action('manage your profile')}
    />
  ))
  .add('Collaborator Details page', () => (
    <CollaboratorForm
      collaborator={collaborator}
      user={user}
      manageProfile={action('manage your profile')}
      affiliations={null}
    />
  ))
  .add('Collaborator Details page - with affiliations', () => (
    <CollaboratorForm
      collaborator={collaborator}
      user={user}
      manageProfile={action('manage your profile')}
      affiliations={[
        ({
          _id: 'MPAffiliation:foo-bar',
          containerID: 'MPProject:foo-bar',
          createdAt: 123123123,
          updatedAt: 123123123,
          manuscriptID: 'MPManuscript:foo-bar',
          sessionID: 123,
          objectType: 'MPAffiliation',
          priority: 1,
          institution: 'Bla bla',
        } as unknown) as Affiliation,
      ]}
    />
  ))
  .add('Collaborator Details page - for the user', () => (
    <CollaboratorForm
      collaborator={user}
      user={user}
      manageProfile={action('manage your profile')}
      affiliations={null}
    />
  ))
  .add('Add collaborators', () => (
    <AddCollaboratorsPage addedCollaboratorsCount={3} />
  ))
  .add('Invite collaborators', () => <InviteCollaboratorsPage />)
  .add('Search collaborators by name', () => (
    <SearchCollaboratorsPage searchText={'bob'} />
  ))
  .add('Search collaborators by email', () => (
    <SearchCollaboratorsPage searchText={'bob@example.com'} />
  ))

storiesOf('Collaboration/Sidebars', module)
  .add('Collaborators - Owner', () => (
    <CollaboratorsSidebar
      project={{
        ...project,
        owners: [people[0].userID],
        viewers: [people[1].userID, people[2].userID],
      }}
      projectCollaborators={people}
      invitations={invitations}
      user={people[0]}
      projectInvite={action('invitation send')}
      projectUninvite={action('invitation deleted')}
      updateUserRole={action('update user role')}
      handleAddCollaborator={action('add collaborator')}
      handleClickCollaborator={action('selected collaborator')}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  ))
  .add('Collaborators - Non-owner', () => (
    <CollaboratorsSidebar
      project={{
        ...project,
        owners: [people[1].userID],
        viewers: [people[0].userID, people[2].userID],
      }}
      projectCollaborators={people}
      invitations={invitations}
      user={people[0]}
      projectInvite={action('invitation send')}
      projectUninvite={action('invitation deleted')}
      updateUserRole={action('update user role')}
      handleAddCollaborator={action('add collaborator')}
      handleClickCollaborator={action('selected collaborator')}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
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
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  ))
  .add('Add Collaborator - few have been added', () => (
    <AddCollaboratorsSidebar
      people={people}
      invitations={[]}
      addCollaborator={action('add collaborator')}
      handleInvite={action('invite')}
      numberOfAddedCollaborators={1}
      countAddedCollaborators={() => 1}
      addedUsers={[people[0].userID]}
      setSearchText={action('set search text')}
      handleDoneCancel={action('handle done/cancel')}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  ))
  .add('Add Collaborator - with invitations', () => (
    <AddCollaboratorsSidebar
      people={people}
      invitations={invitations}
      addCollaborator={action('add collaborator')}
      handleInvite={action('invite')}
      numberOfAddedCollaborators={0}
      countAddedCollaborators={() => 0}
      addedUsers={[]}
      setSearchText={action('set search text')}
      handleDoneCancel={action('handle done/cancel')}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  ))
  .add('Invite Collaborators', () => (
    <InviteCollaboratorsSidebar
      invitationValues={{ name: '', email: 'user@example.com', role: '' }}
      handleCancel={action('cancel')}
      handleSubmit={action('submit')}
      invitationSent={false}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  ))
  .add('Search Collaborators', () => (
    <SearchCollaboratorsSidebar
      addCollaborator={action('add collaborator')}
      countAddedCollaborators={() => 3}
      handleInvite={action('invite')}
      searchResults={people}
      searchText={'ego'}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  ))
  .add('Search Collaborators - Empty', () => (
    <SearchCollaboratorsSidebar
      addCollaborator={action('add collaborator')}
      countAddedCollaborators={() => 3}
      handleInvite={action('invite')}
      searchResults={[]}
      searchText={'ego'}
      tokenActions={{
        delete: action('delete token'),
        update: action('update token'),
      }}
    />
  ))
  .add('Uninvite Collaborators', () => (
    <UninviteCollaboratorPopper
      invitedUserName={''}
      handleUninvite={action('Uninvite')}
      switchMode={action('switch mode')}
    />
  ))
  .add('Remove Collaborators', () => (
    <RemoveCollaboratorPopper
      collaborator={people[0]}
      handleRemove={action('remove')}
      switchMode={action('switch mode')}
    />
  ))
