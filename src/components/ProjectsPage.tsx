import React from 'react'
import ProjectsSidebar from '../containers/ProjectsSidebar'
import { styled } from '../theme'
import { Project } from '../types/components'
import { AddProject } from '../types/project'
import { GlobalMenu } from './GlobalMenu'

const Container = styled.div`
  height: 100vh;
  flex: 1;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
`

const Body = styled.div`
  flex: 1;
  display: flex;
`

const Main = styled.main`
  flex: 1;
  padding: 16px;
`

interface Props {
  projects: Project[]
  addProject: AddProject
}

export const ProjectsPage: React.SFC<Props> = ({ projects, addProject }) => (
  <Container>
    <GlobalMenu />
    <Body>
      <ProjectsSidebar projects={projects} addProject={addProject} />
      <Main />
    </Body>
  </Container>
)
