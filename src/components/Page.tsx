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

import '@manuscripts/style-guide/styles/tip.css'

import AppIcon from '@manuscripts/assets/react/AppIcon'
import ContributorsIcon from '@manuscripts/assets/react/ContributorsIcon'
import EditProjectIcon from '@manuscripts/assets/react/EditProjectIcon'
import ReferenceLibraryIcon from '@manuscripts/assets/react/ReferenceLibraryIcon'
import { Project } from '@manuscripts/manuscripts-json-schema'
import { Tip } from '@manuscripts/style-guide'
import React from 'react'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import config from '../config'
import { TokenActions } from '../data/TokenData'
import { titleText } from '../lib/title'
import { Chatbox } from './Chatbox'
import MenuBar from './nav/MenuBar'
import OfflineIndicator from './OfflineIndicator'
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
  color: ${(props) => props.theme.colors.text.primary};
  font-family: ${(props) => props.theme.font.family.sans};
  // border-top: 1px solid ${(props) => props.theme.colors.background.info};
`

const ViewsBar = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.colors.border.tertiary};
  display: flex;
  height: 100%;
  flex-direction: column;
  width: 56px;
`

const IconBar = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;

  div {
    margin: ${(props) => props.theme.grid.unit * 5}px 0 0;
    text-align: center;
    width: 56px;
  }
`

const ViewLink = styled(NavLink)`
  align-items: center;
  color: ${(props) => props.theme.colors.button.secondary.color.default};
  display: flex;
  justify-content: center;
  width: 100%;
  height: ${(props) => props.theme.grid.unit * 8}px;

  &:hover {
    color: ${(props) => props.theme.colors.brand.medium};
  }
  &.active {
    color: ${(props) => props.theme.colors.brand.medium};
    background: ${(props) => props.theme.colors.brand.xlight};
  }
`

const ViewsSeparator = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border.secondary};
  width: ${(props) => props.theme.grid.unit * 7}px;
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
        <title>
          Manuscripts.io:{' '}
          {project.title ? titleText(project.title) : 'Untitled Project'}
        </title>
      ) : (
        <title>Manuscripts.io</title>
      )}
    </Helmet>

    {project && (
      <ViewsBar>
        <ProjectNavigator />

        {config.native || (
          <>
            <MenuBar tokenActions={tokenActions!}>
              <Tip title={'Home'} placement={'right'}>
                <OfflineIndicator>
                  <AppIcon width={34} height={34} />
                </OfflineIndicator>
              </Tip>
            </MenuBar>

            <ViewsSeparator />
          </>
        )}

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
            <ViewLink to={`/projects/${project._id}/library`}>
              <ProjectLibraryIcon />
            </ViewLink>
          </Tip>

          {config.local || (
            <Tip title={'Collaborators ⌥⌘5'} placement={'right'}>
              <ViewLink
                to={`/projects/${project._id}/collaborators`}
                exact={true}
              >
                <ProjectContributorsIcon data-cy={'collaborators'} />
              </ViewLink>
            </Tip>
          )}
        </IconBar>

        <Support />
      </ViewsBar>
    )}

    {config.crisp.id && <Chatbox />}

    {children}
  </PageContainer>
)
