import React from 'react'
import { styled } from '../../theme/styled-components'
import AcceptProjectInvitation from '../collaboration/AcceptProjectInvitation'
import MessageBanner from '../MessageBanner'
import { GlobalMenu } from '../nav/GlobalMenu'
import { Main, Page } from '../Page'
import ProjectsSidebarContainer from './ProjectsSidebarContainer'

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
`

const ProjectsPageContainer: React.FunctionComponent = () => (
  <Page>
    <Main>
      <Container>
        <GlobalMenu active={'projects'} />
        <MessageBanner />
        <AcceptProjectInvitation />
        <ProjectsSidebarContainer />
      </Container>
    </Main>
  </Page>
)

export default ProjectsPageContainer
