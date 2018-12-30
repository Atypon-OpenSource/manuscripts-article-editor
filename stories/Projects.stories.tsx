import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { EmptyProjectPage } from '../src/components/projects/EmptyProjectPage'
import ManuscriptSidebar from '../src/components/projects/ManuscriptSidebar'
import { ProjectsPage } from '../src/components/projects/ProjectsPage'
import manuscripts from './data/manuscripts'
import projects from './data/projects'

storiesOf('Projects', module)
  .add('Projects Page', () => (
    <ProjectsPage
      projects={projects}
      getCollaborators={action('get collaborator')}
      addProject={action('add project')}
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
      saveProject={action('save')}
      selected={null}
      view={null}
      doc={null}
    />
  ))
