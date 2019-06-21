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
import { Tip } from '@manuscripts/style-guide'
import '@manuscripts/style-guide/styles/tip.css'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { styled } from '../../theme/styled-components'
import ProjectsButton from './ProjectsButton'
import UserContainer from './UserContainer'

export const MenuContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  color: ${props => props.theme.colors.menu.text};
  font-family: ${props => props.theme.fontFamily};
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
  border-bottom: 1px solid
    ${props => props.theme.colors.sidebar.background.selected};
`

export const MenuBarIcon = styled.button`
  height: 58px;
  width: 58px;
  padding: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: inherit;

  &:focus {
    outline: none;
  }
`

export const MenuSections = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const MenuSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`

export const MenuLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  text-decoration: none;
  color: inherit;
  border: solid 2px ${props => props.theme.colors.menu.button};
  border-radius: 4px;
  margin-left: 20px;

  &.active {
    background: ${props => props.theme.colors.menu.button};
    color: white;
  }

  &:hover {
    background: white;
    color: ${props => props.theme.colors.menu.button};
    border: solid 2px ${props => props.theme.colors.menu.button};
  }
`

export const FilledMenuBarIcon = styled(MenuBarIcon)`
  & path {
    fill: ${props => props.theme.colors.menu.icon.default};
  }

  &:hover path {
    fill: ${props => props.theme.colors.menu.icon.selected};
  }
`

const MenuContainerWithBorder = styled(MenuContainer)`
  border-top: 1px solid
    ${props => props.theme.colors.sidebar.background.selected};
`

interface Props {
  handleClose: React.MouseEventHandler<HTMLElement>
}

export const Menu: React.FunctionComponent<Props> = ({ handleClose }) => (
  <MenuContainerWithBorder>
    <FilledMenuBarIcon onClick={handleClose}>
      <Tip title={'Back to Editor'} placement={'bottom-end'}>
        <NavIcon />
      </Tip>
    </FilledMenuBarIcon>

    <MenuSections>
      <MenuSection>
        <ProjectsButton isDropdown={true} />
      </MenuSection>

      <MenuSection>
        <UserContainer />
      </MenuSection>
    </MenuSections>
  </MenuContainerWithBorder>
)
