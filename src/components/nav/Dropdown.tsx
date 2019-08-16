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

import ArrowDownUp from '@manuscripts/assets/react/ArrowDownUp'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { styled } from '../../theme/styled-components'
import { Badge } from '../Badge'

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`

export const Dropdown = styled.div`
  position: absolute;
  top: 32px;
  left: 5px;
  border: 1px solid ${props => props.theme.colors.dropdown.border};
  border-radius: 4px;
  box-shadow: 0 4px 11px 0 rgba(0, 0, 0, 0.1);
  background: ${props => props.theme.colors.dropdown.background.default};
  color: #000;
  font-size: 14px;
  font-weight: normal;
  z-index: 10;
`

export const PlaceholderTitle = styled(Title)`
  color: ${props => props.theme.colors.title.placeholder};
`

export const InvitedBy = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  letter-spacing: -0.3px;
  color: ${props => props.theme.colors.dropdown.text.secondary};
  clear: both;
  margin-top: 6px;
`

export const DropdownLink = styled(NavLink)<{ disabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 13px 13px;
  align-items: center;
  text-decoration: none;
  white-space: nowrap;
  color: ${props =>
    props.disabled
      ? props.theme.colors.dropdown.text.secondary
      : props.theme.colors.dropdown.text.primary};
  pointer-events: ${props => (props.disabled ? 'none' : 'unset')};

  &:hover,
  &:hover ${PlaceholderTitle} {
    background: ${props => props.theme.colors.dropdown.background.hovered};
    color: ${props => props.theme.colors.dropdown.text.hovered};
  }
`

export const DropdownElement = styled.div<{ disabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 13px;
  text-decoration: none;
  color: ${props =>
    props.disabled
      ? props.theme.colors.dropdown.text.secondary
      : props.theme.colors.dropdown.text.primary};
  white-space: nowrap;
  cursor: pointer;
  pointer-events: ${props => (props.disabled ? 'none' : 'unset')};

  &:hover {
    background: ${props => props.theme.colors.dropdown.background.hovered};
    color: ${props => props.theme.colors.dropdown.text.hovered};
  }

  &:hover .user-icon-path {
    fill: white;
  }

  &:hover ${InvitedBy} {
    color: ${props => props.theme.colors.dropdown.text.hovered};
  }
`

export const DropdownSeparator = styled.div`
  height: 1px;
  width: 100%;
  opacity: 0.23;
  background-color: ${props => props.theme.colors.dropdown.separator};
`

export const DropdownButtonText = styled.div`
  display: flex;
  margin-right: 3px;
`

interface DropdownProps {
  isOpen: boolean
}

export const DropdownToggle = styled(ArrowDownUp)`
  margin-left: 6px;
  transform: rotate(180deg);

  & path {
    stroke: currentColor;
  }

  &.open {
    transform: rotate(0deg);

    & path {
      stroke: white;
    }
  }
`

export const NotificationsBadge = styled(Badge)<DropdownProps>`
  margin-left: 4px;
  color: ${props =>
    props.isOpen ? props.theme.colors.dropdown.notification.default : 'white'};
  background-color: ${props =>
    props.isOpen ? 'white' : props.theme.colors.dropdown.notification.default};
  font-size: 9px;
  min-width: 10px;
  min-height: 10px;
  font-family: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`

export const DropdownButtonContainer = styled.button<DropdownProps>`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  text-decoration: none;
  border: none;
  font-size: inherit;
  border-radius: 4px;
  margin-left: 20px;
  cursor: pointer;
  background-color: ${props =>
    props.isOpen ? props.theme.colors.button.primary : 'white'};
  color: ${props => (props.isOpen ? 'white' : 'inherit')};

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${props => props.theme.colors.button.primary};
    color: white;
  }

  &:hover ${NotificationsBadge} {
    background-color: white;
    color: ${props => props.theme.colors.button.primary};
  }
`

interface DropdownButtonProps {
  isOpen: boolean
  notificationsCount?: number
  onClick?: React.MouseEventHandler
  removeChevron?: boolean
}

export const DropdownButton: React.FunctionComponent<DropdownButtonProps> = ({
  children,
  isOpen,
  notificationsCount,
  onClick,
  removeChevron,
}) => (
  <DropdownButtonContainer
    onClick={onClick}
    isOpen={isOpen}
    className={'dropdown-toggle'}
  >
    <DropdownButtonText>{children}</DropdownButtonText>
    {!!notificationsCount && (
      <NotificationsBadge isOpen={isOpen}>
        {notificationsCount}
      </NotificationsBadge>
    )}
    {!removeChevron && <DropdownToggle className={isOpen ? 'open' : ''} />}
  </DropdownButtonContainer>
)
