import { storiesOf } from '@storybook/react'
import React from 'react'
import {
  EmptyProjectsDropdownList,
  ProjectsDropdownList,
} from '../src/components/ProjectsDropdownList'
import projects from './data/projects'

storiesOf('Projects Dropdown List', module)
  .add('With projects', () => <ProjectsDropdownList projects={projects} />)
  .add('Without projects', () => (
    <EmptyProjectsDropdownList>No projects yet</EmptyProjectsDropdownList>
  ))
