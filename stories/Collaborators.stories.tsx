import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { Formik } from 'formik'
import React from 'react'
import AddCollaboratorPopper from '../src/components/AddCollaboratorPopper'
// import AddCollaboratorsSidebar from '../src/components/AddCollaboratorsSidebar'
import CollaboratorSettingsPopper from '../src/components/CollaboratorSettingsPopper'
import {
  AddCollaboratorsPage,
  CollaboratorDetailsPage,
  InviteCollaboratorsPage,
  SearchCollaboratorsPage,
} from '../src/components/CollaboratorsPage'
// import CollaboratorsSidebar from '../src/components/CollaboratorsSidebar'
import { InvitationForm } from '../src/components/InvitationForm'
import InviteCollaboratorPopper from '../src/components/InviteCollaboratorPopper'
import InviteCollaboratorsSidebar from '../src/components/InviteCollaboratorsSidebar'
import SearchCollaboratorsSidebar from '../src/components/SearchCollaboratorsSidebar'
import { styled } from '../src/theme'
import { projectInvitationSchema } from '../src/validation'
import { user } from './data/contributors'
import { people } from './data/people'
import { project } from './data/projects'

const PopperStory = styled.div`
  width: 300px;
`

const SidebarStory = styled.div`
  width: 800px;
`

storiesOf('Collaborators/Poppers', module)
  .add('Add', () => (
    <PopperStory>
      <AddCollaboratorPopper addCollaborator={action('add collaborator')} />
    </PopperStory>
  ))
  .add('Settings and Remove', () => (
    <PopperStory>
      <CollaboratorSettingsPopper
        collaborator={user}
        handleUpdateRole={action('update role')}
        handleRemove={action('remove')}
      />
    </PopperStory>
  ))
  .add('Invite and Uninvite', () => (
    <PopperStory>
      <InviteCollaboratorPopper
        invitedUserName={'Example User'}
        projectInvite={action('invite')}
        projectUninvite={action('uninvite')}
      />
    </PopperStory>
  ))

storiesOf('Collaborators/Forms', module).add('Invite', () => (
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

storiesOf('Collaborators/Pages', module)
  .add('No collaborators', () => (
    <CollaboratorDetailsPage
      project={project}
      collaboratorsCount={0}
      handleAddCollaborator={action('add collaborator')}
    />
  ))
  .add('Collaborator details', () => (
    <CollaboratorDetailsPage
      project={project}
      collaboratorsCount={3}
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

storiesOf('Collaborators/Sidebars', module)
  // .add('Collaborators', () => <CollaboratorsSidebar />)
  // .add('Add Collaborator', () => <AddCollaboratorsSidebar />)
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
