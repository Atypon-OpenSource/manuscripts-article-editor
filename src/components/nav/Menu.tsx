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
import { IconButton, Tip } from '@manuscripts/style-guide'
import '@manuscripts/style-guide/styles/tip.css'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { styled } from '../../theme/styled-components'
import OfflineIndicator from '../OfflineIndicator'
import ProjectsButton from './ProjectsButton'
import UserContainer from './UserContainer'

export const MenuContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  color: ${props => props.theme.colors.text.secondary};
  font-family: ${props => props.theme.font.family.sans};
  font-weight: ${props => props.theme.font.weight.medium};
  font-size: ${props => props.theme.font.size.medium};
  white-space: nowrap;
  border-bottom: 1px solid ${props => props.theme.colors.border.secondary};
`

export const MenuBarIcon = styled(IconButton).attrs(props => ({
  defaultColor: true,
  size: 34,
}))`
  border: 0;
  margin: 15px 11px;
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
  margin-right: ${props => props.theme.grid.unit * 5}px;
  margin-left: ${props => props.theme.grid.unit * 4}px;
`

export const MenuLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.grid.unit}px
    ${props => props.theme.grid.unit * 2}px;
  text-decoration: none;
  color: inherit;
  border: solid 2px ${props => props.theme.colors.brand.default};
  border-radius: ${props => props.theme.grid.radius.small};
  margin-left: 20px;

  &.active {
    background: ${props => props.theme.colors.brand.default};
    color: ${props => props.theme.colors.text.onDark};
  }

  &:hover {
    background: ${props => props.theme.colors.background.primary};
    color: ${props => props.theme.colors.brand.default};
    border: solid 2px ${props => props.theme.colors.brand.default};
  }
`

export const FilledMenuBarIcon = styled(MenuBarIcon)``

const MenuContainerWithBorder = styled(MenuContainer)``

interface Props {
  handleClose: React.MouseEventHandler<HTMLElement>
}

export const Menu: React.FunctionComponent<Props> = ({ handleClose }) => (
  <MenuContainerWithBorder>
    <FilledMenuBarIcon onClick={handleClose}>
      <OfflineIndicator>
        <Tip title={'Back to Editor'} placement={'bottom-end'}>
          <AppIcon width={34} height={34} />
        </Tip>
      </OfflineIndicator>
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
