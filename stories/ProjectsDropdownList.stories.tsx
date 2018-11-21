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
      rejectInvitation={action('reject invitation')}
      addProject={action('add project')}
      acceptError={null}
    />
  ))
  .add('With projects', () => (
    <ProjectsDropdownList
      projects={projects}
      invitationsData={[]}
      acceptedInvitations={[]}
      rejectedInvitations={[]}
      acceptInvitation={action('accept invitation')}
      rejectInvitation={action('reject invitation')}
      addProject={action('add project')}
      acceptError={null}
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
      rejectInvitation={action('reject invitation')}
      addProject={action('add project')}
      acceptError={null}
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
      rejectInvitation={action('reject invitation')}
      addProject={action('add project')}
      acceptError={null}
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
      rejectInvitation={action('reject invitation')}
      addProject={action('add project')}
      acceptError={null}
    />
  ))
