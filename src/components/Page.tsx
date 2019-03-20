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

import ContributorsIcon from '@manuscripts/assets/react/ContributorsIcon'
import EditProjectIcon from '@manuscripts/assets/react/EditProjectIcon'
import NavIcon from '@manuscripts/assets/react/NavIcon'
import ReferenceLibraryIcon from '@manuscripts/assets/react/ReferenceLibraryIcon'
import { Project } from '@manuscripts/manuscripts-json-schema'
import React from 'react'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'
import { linkWaterBlue } from '../theme/colors'
import { styled } from '../theme/styled-components'
import MenuBar from './nav/MenuBar'
import ProjectNavigator from './ProjectNavigator'
import { Tip } from './Tip'

export const Main = styled.main`
  height: 100vh;
  flex: 1;
  position: relative;
  box-sizing: border-box;
`

export const Centered = styled(Main)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  box-sizing: border-box;
  color: ${props => props.theme.colors.global.text.primary};
  font-family: ${props => props.theme.fontFamily};
`

const ViewsBar = styled.div`
  height: 100vh;
  width: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`

const IconBar = styled.div`
  flex: 1;
  width: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
`

const ViewLink = styled(NavLink)`
  margin: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  color: ${props => props.theme.colors.iconBar.background.default};
  border: 1.5px solid transparent;

  &.active {
    border-color: ${props => props.theme.colors.iconBar.background.default};
  }
`

const ViewsSeparator = styled.div`
  border: solid 0.5px ${linkWaterBlue};
  width: 30px;
`

const StyledEditProjectIcon = styled(EditProjectIcon)`
  g {
    stroke: currentColor;
  }
`

const ProjectLibraryIcon = styled(ReferenceLibraryIcon)`
  path {
    stroke: currentColor;
  }
`

const ProjectContributorsIcon = styled(ContributorsIcon)`
  path {
    stroke: currentColor;
  }

  circle {
    stroke: currentColor;
  }
`

const StyledIcon = styled(NavIcon)`
  & path {
    fill: ${props => props.theme.colors.menu.icon.default};
  }

  &:hover path {
    fill: ${props => props.theme.colors.menu.icon.selected};
  }
`

interface Props {
  project?: Project
}

export const Page: React.FunctionComponent<Props> = ({ children, project }) => (
  <PageContainer>
    <Helmet>
      {project ? (
        <title>Manuscripts.io: {project.title || 'Untitled Project'}</title>
      ) : (
        <title>Manuscripts.io</title>
      )}
    </Helmet>

    {project && (
      <ViewsBar>
        <ProjectNavigator />

        <MenuBar projectID={project._id}>
          <Tip title={'Home'} placement={'right'}>
            <StyledIcon />
          </Tip>
        </MenuBar>

        <ViewsSeparator />

        <IconBar>
          <Tip title={'Edit ⌥⌘3'} placement={'right'}>
            <ViewLink
              to={`/projects/${project._id}`}
              isActive={(match, location) =>
                /^\/projects\/.+?\/manuscripts\/.+/.test(location.pathname)
              }
            >
              <StyledEditProjectIcon />
            </ViewLink>
          </Tip>

          <Tip title={'Library ⌥⌘4'} placement={'right'}>
            <ViewLink to={`/projects/${project._id}/library`} exact={true}>
              <ProjectLibraryIcon />
            </ViewLink>
          </Tip>

          <Tip title={'Collaborators ⌥⌘5'} placement={'right'}>
            <ViewLink
              to={`/projects/${project._id}/collaborators`}
              exact={true}
            >
              <ProjectContributorsIcon data-cy={'collaborators'} />
            </ViewLink>
          </Tip>
        </IconBar>
      </ViewsBar>
    )}

    {children}
  </PageContainer>
)
