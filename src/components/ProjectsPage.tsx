import React from 'react'
import { ProjectInfo } from '../containers/ProjectsPageContainer'
import ProjectsSidebar from '../containers/ProjectsSidebar'
import { styled } from '../theme'
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
  projects: ProjectInfo[]
  addProject: AddProject
}

export const ProjectsPage: React.SFC<Props> = ({ projects, addProject }) => (
  <Container>
    <GlobalMenu active={'projects'} />
    <ProjectsSidebar projects={projects} addProject={addProject} />
  </Container>
)
