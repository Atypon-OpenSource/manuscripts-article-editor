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

import AppIcon from '@manuscripts/assets/react/AppIcon'
import React from 'react'
import styled from 'styled-components'

import OfflineIndicator from '../OfflineIndicator'
import { Support } from '../Support'
import {
  FilledMenuBarIcon,
  MenuContainer,
  MenuSection,
  MenuSections,
} from './Menu'
import ProjectsButton from './ProjectsButton'
import { UpdatesContainer } from './UpdatesContainer'
import UserContainer from './UserContainer'

interface Props {
  active: string
}

const Container = styled.div`
  font-size: ${(props) => props.theme.font.size.large};
  font-weight: ${(props) => props.theme.font.weight.medium};
  padding: ${(props) => props.theme.grid.unit}px
    ${(props) => props.theme.grid.unit * 2}px;
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
  user-select: none;
`

const StyledMenuSection = styled(MenuSection)`
  margin-left: ${(props) => props.theme.grid.unit * 2}px;
`

export const GlobalMenu: React.FunctionComponent<Props> = ({ active }) => (
  <MenuContainer>
    <FilledMenuBarIcon>
      <OfflineIndicator>
        <AppIcon width={34} height={34} />
      </OfflineIndicator>
    </FilledMenuBarIcon>
    <MenuSections>
      <StyledMenuSection>
        {active === 'projects' ? (
          <Container>Projects</Container>
        ) : (
          <ProjectsButton isDropdown={true} />
        )}

        {/* <MenuLink to={`/people`}>People</MenuLink> */}
      </StyledMenuSection>

      <MenuSection>
        <Support />
        <UpdatesContainer />
        <UserContainer />
      </MenuSection>
    </MenuSections>
  </MenuContainer>
)
