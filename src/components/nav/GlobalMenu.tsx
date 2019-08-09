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

import NavIcon from '@manuscripts/assets/react/NavIcon'
import React from 'react'
import { styled } from '../../theme/styled-components'
import { Support } from '../Support'
import {
  FilledMenuBarIcon,
  MenuContainer,
  MenuSection,
  MenuSections,
} from './Menu'
import { OfflineContainer } from './OfflineContainer'
import ProjectsButton from './ProjectsButton'
import { UpdatesContainer } from './UpdatesContainer'
import UserContainer from './UserContainer'

interface Props {
  active: string
}

const Container = styled.div`
  padding: 5px 10px;
  margin-left: 20px;
  user-select: none;

  &:hover {
    cursor: default;
  }
`

export const GlobalMenu: React.FunctionComponent<Props> = ({ active }) => (
  <MenuContainer>
    <FilledMenuBarIcon>
      <OfflineContainer>
        <NavIcon />
      </OfflineContainer>
    </FilledMenuBarIcon>
    <MenuSections>
      <MenuSection>
        {active === 'projects' ? (
          <Container>Projects</Container>
        ) : (
          <ProjectsButton isDropdown={true} />
        )}

        {/* <MenuLink to={`/people`}>People</MenuLink> */}
      </MenuSection>

      <MenuSection>
        <UpdatesContainer />
        <Support />
        <UserContainer />
      </MenuSection>
    </MenuSections>
  </MenuContainer>
)
