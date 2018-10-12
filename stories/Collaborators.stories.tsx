import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Formik } from 'formik'
import React from 'react'
import AddCollaboratorPopper from '../src/components/collaboration/AddCollaboratorPopper'
import AddCollaboratorsSidebar from '../src/components/collaboration/AddCollaboratorsSidebar'
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
import SearchCollaboratorsSidebar from '../src/components/collaboration/SearchCollaboratorsSidebar'
import { styled } from '../src/theme'
import { projectInvitationSchema } from '../src/validation'
import { user } from './data/contributors'
import { invitations } from './data/invitations-data'
import { people } from './data/people'
import { project } from './data/projects'

const PopperStory = styled.div`
  width: 300px;
`

const SidebarStory = styled.div`
  width: 800px;
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
      />
    </PopperStory>
  ))

storiesOf('Collaboration/Forms', module).add('Invite', () => (
  <PopperStory>
    <Formik
      initialValues={{
        name: '',
        email: '',
        role: '',
      }}
      onSubmit={action('submit')}
      isInitialValid={true}
      validateOnChange={false}
      validateOnBlur={false}
      component={InvitationForm}
      validationSchema={projectInvitationSchema}
    />
  </PopperStory>
))

storiesOf('Collaboration/Pages', module)
  .add('No collaborators', () => (
    <CollaboratorDetailsPage
      project={project}
      collaboratorsCount={0}
      user={user}
      handleAddCollaborator={action('add collaborator')}
    />
  ))
  .add('Collaborator details', () => (
    <CollaboratorDetailsPage
      project={project}
      collaboratorsCount={3}
      user={user}
      handleAddCollaborator={action('add collaborator')}
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
  .add('Collaborators', () => (
    <CollaboratorsSidebar
      project={project}
      collaborators={people}
      invitations={[]}
      user={people[0]}
      handleAddCollaborator={action('add collaborator')}
      handleHover={action('hover')}
      hoveredID={''}
      openPopper={action('open popper')}
      isSettingsOpen={true}
    />
  ))
  .add('Add Collaborator', () => (
    <AddCollaboratorsSidebar
      people={people}
      invitations={[]}
      addCollaborator={action('add collaborator')}
      handleSearchChange={action('search change')}
      handleSearchFocus={action('search focus')}
      handleInvite={action('invite')}
      numberOfAddedCollaborators={0}
      countAddedCollaborators={() => 0}
      isSearching={false}
      searchText={''}
      searchResults={[]}
      addedUsers={[]}
      handleDoneCancel={action('handle done/cancel')}
    />
  ))

  .add('Invite Collaborators', () => (
    <InviteCollaboratorsSidebar
      initialValues={{ name: '', email: 'user@example.com', role: '' }}
      handleCancel={action('cancel')}
      onSubmit={action('submit')}
    />
  ))
  .add('Search Collaborators', () => (
    <SidebarStory>
      <SearchCollaboratorsSidebar
        addCollaborator={action('add collaborator')}
        countAddedCollaborators={() => 3}
        handleInvite={action('invite')}
        searchResults={people}
        searchText={'ego'}
      />
    </SidebarStory>
  ))
