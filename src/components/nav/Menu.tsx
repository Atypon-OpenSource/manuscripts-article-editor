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
