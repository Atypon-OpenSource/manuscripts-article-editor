import React from 'react'
import ProjectsSidebar from '../containers/ProjectsSidebar'
import { styled } from '../theme'
import { Project, UserProfile } from '../types/components'
import { AddProject } from '../types/project'
import { GlobalMenu } from './GlobalMenu'

const Container = styled.div`
  height: 100vh;
  flex: 1;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
`

interface Props {
  projects: Project[]
  addProject: AddProject
  getCollaborators: (project: Project) => UserProfile[]
}

export const ProjectsPage: React.SFC<Props> = ({
  projects,
  addProject,
  getCollaborators,
}) => (
  <Container>
    <GlobalMenu active={'projects'} />
    <ProjectsSidebar
      projects={projects}
      addProject={addProject}
      getCollaborators={getCollaborators}
    />
  </Container>
)
