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
import { SecondaryButton } from '@manuscripts/style-guide'
import { Title } from '@manuscripts/title-editor'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { Badge } from '../Badge'

export const DropdownContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`

export const Dropdown = styled.div<{
  direction?: 'left' | 'right'
  minWidth?: number
  top?: number
}>`
  border: 1px solid ${props => props.theme.colors.border.secondary};
  border-radius: ${props => props.theme.grid.radius.small};
  box-shadow: ${props => props.theme.shadow.dropShadow};
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  flex-direction: column;
  font-size: ${props => props.theme.font.size.normal};
  font-weight: ${props => props.theme.font.weight.normal};
  max-height: 80vh;
  max-width: 300px;
  ${props => props.minWidth && 'min-width: ' + props.minWidth + 'px;'}
  ${props => (props.direction === 'right' ? ' right: 0' : 'left : 0')};
  top: ${props => (props.top ? props.top : props.theme.grid.unit * 10)}px;
  position: absolute;
  z-index: 10;
`

export const PlaceholderTitle = styled(Title)`
  color: ${props => props.theme.colors.text.secondary};
`

export const InvitedBy = styled.div`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.font.size.normal};
  letter-spacing: -0.3px;
  color: ${props => props.theme.colors.text.secondary};
  clear: both;
  margin-top: ${props => props.theme.grid.unit * 2}px;
`

const commonStyles = css<{ disabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.grid.unit * 3}px
    ${props => props.theme.grid.unit * 3}px;
  align-items: center;
  text-decoration: none;
  white-space: nowrap;
  color: ${props =>
    props.disabled
      ? props.theme.colors.text.secondary
      : props.theme.colors.text.primary};
  pointer-events: ${props => (props.disabled ? 'none' : 'unset')};

  &:hover,
  &:hover ${PlaceholderTitle} {
    background: ${props => props.theme.colors.background.fifth};
  }
`

export const DropdownLink = styled(NavLink)`
  ${commonStyles};
`

export const DropdownElement = styled.div`
  ${commonStyles};

  cursor: pointer;

  &:hover .user-icon-path {
    fill: ${props => props.theme.colors.text.onDark};
  }
`

export const DropdownSeparator = styled.div`
  height: 1px;
  width: 100%;
  opacity: 0.23;
  background-color: ${props => props.theme.colors.border.primary};
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

  path {
    stroke: currentColor;
  }

  &.open {
    transform: rotate(0deg);
  }
`

export const NotificationsBadge = styled(Badge)<DropdownProps>`
  background-color: ${props =>
    props.isOpen
      ? props.theme.colors.background.success
      : props.theme.colors.brand.default};
  color: ${props =>
    props.isOpen
      ? props.theme.colors.text.success
      : props.theme.colors.text.onDark};
  font-family: ${props => props.theme.font.family.sans};
  font-size: 9px;
  margin-left: 4px;
  max-height: 10px;
  min-width: 10px;
  min-height: 10px;
`

export const DropdownButtonContainer = styled(SecondaryButton).attrs(
  (props: DropdownProps) => ({
    selected: props.isOpen,
  })
)<DropdownProps>``

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
