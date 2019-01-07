import React from 'react'
import { styled } from '../../theme'
import AcceptProjectInvitation from '../collaboration/AcceptProjectInvitation'
import MessageBanner from '../MessageBanner'
import { GlobalMenu } from '../nav/GlobalMenu'
import { Main, Page } from '../Page'
import ProjectsSidebar from './ProjectsSidebar'

const Container = styled.div`
  height: 100vh;
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
        <ProjectsSidebar />
      </Container>
    </Main>
  </Page>
)

export default ProjectsPageContainer
