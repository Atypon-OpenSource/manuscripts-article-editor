import { Project, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { styled } from '../../theme'
import { GlobalMenu } from '../nav/GlobalMenu'
import ProjectsSidebar from './ProjectsSidebar'

const Container = styled.div`
  height: 100vh;
  flex: 1;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
`

interface Props {
  projects: Project[]
  addProject: () => void
  getCollaborators: (project: Project) => UserProfile[]
}

export const ProjectsPage: React.FunctionComponent<Props> = ({
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
