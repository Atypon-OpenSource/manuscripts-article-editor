/*!
 * © 2019 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  height: 100%;
  overflow-y: auto;
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
