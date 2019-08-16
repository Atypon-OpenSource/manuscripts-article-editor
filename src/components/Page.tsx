/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2019 Atypon Systems LLC. All Rights Reserved.
 */

import ContributorsIcon from '@manuscripts/assets/react/ContributorsIcon'
import EditProjectIcon from '@manuscripts/assets/react/EditProjectIcon'
import NavIcon from '@manuscripts/assets/react/NavIcon'
import ReferenceLibraryIcon from '@manuscripts/assets/react/ReferenceLibraryIcon'
import { Project } from '@manuscripts/manuscripts-json-schema'
import { Tip } from '@manuscripts/style-guide'
import '@manuscripts/style-guide/styles/tip.css'
import React from 'react'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'
import config from '../config'
import { TokenActions } from '../data/TokenData'
import { linkWaterBlue } from '../theme/colors'
import { styled } from '../theme/styled-components'
import { Chatbox } from './Chatbox'
import MenuBar from './nav/MenuBar'
import { OfflineContainer } from './nav/OfflineContainer'
import ProjectNavigator from './ProjectNavigator'
import { Support } from './Support'

export const Main = styled.main`
  height: 100%;
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
  height: calc(100vh - 1px); /* allow 1px for the top border */
  box-sizing: border-box;
  color: ${props => props.theme.colors.global.text.primary};
  font-family: ${props => props.theme.fontFamily};
  border-top: 1px solid
    ${props => props.theme.colors.sidebar.background.selected};
`

const ViewsBar = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-right: 1px solid
    ${props => props.theme.colors.sidebar.background.selected};
`

const IconBar = styled.div`
  flex: 1;
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

const StyledNavIcon = styled(NavIcon)`
  & path {
    fill: ${props => props.theme.colors.menu.icon.default};
  }

  &:hover path {
    fill: ${props => props.theme.colors.menu.icon.selected};
  }
`

interface Props {
  project?: Project
  tokenActions?: TokenActions
}

export const Page: React.FunctionComponent<Props> = ({
  children,
  project,
  tokenActions,
}) => (
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

        <MenuBar tokenActions={tokenActions!}>
          <Tip title={'Home'} placement={'right'}>
            <OfflineContainer>
              <StyledNavIcon />
            </OfflineContainer>
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
            <ViewLink
              to={`/projects/${project._id}/library/library`}
              isActive={(match, location) => {
                return location.pathname.indexOf('/library/') > 0
              }}
            >
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

        <Support />
      </ViewsBar>
    )}

    {config.crisp.id && <Chatbox />}

    {children}
  </PageContainer>
)
