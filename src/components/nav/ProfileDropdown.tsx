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
import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Avatar } from '@manuscripts/style-guide'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Dropdown, DropdownContainer } from './Dropdown'

export const ProfileDropdown: React.FC<{
  user: UserProfileWithAvatar
}> = ({ children, user }) => {
  const [open, setOpen] = useState(false)

  const nodeRef = useRef<HTMLDivElement>(null)

  const toggleOpen = useCallback(() => {
    setOpen((value) => !value)
  }, [])

  const handleClickOutside = useCallback((event: Event) => {
    if (nodeRef.current && !nodeRef.current.contains(event.target as Node)) {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClickOutside, open])

  return (
    <DropdownContainer id={'user-dropdown'} ref={nodeRef}>
      <DropdownButton
        onClick={toggleOpen}
        isOpen={open}
        className={'dropdown-toggle'}
      >
        <AvatarContainer>
          <Avatar src={user.avatar} size={32} />
        </AvatarContainer>
        <DropdownToggle />
      </DropdownButton>

      {open && (
        <Dropdown direction={'right'} minWidth={100}>
          {children}
        </Dropdown>
      )}
    </DropdownContainer>
  )
}

const AvatarContainer = styled.div`
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  border-radius: 50%;
  box-sizing: border-box;

  svg:hover path,
  path {
    fill: currentColor;
  }
`

const DropdownToggle = styled(ArrowDownUp)`
  margin-left: 6px;

  & path {
    stroke: currentColor;
  }
`

const styledAvatar = css`
  ${AvatarContainer}:after {
    border: 2px solid ${(props) => props.theme.colors.brand.medium};
    border-radius: 50%;
    display: block;
    height: 30px;
    position: absolute;
    width: 30px;
  }
`

const DropdownButton = styled.button<{
  isOpen: boolean
}>`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  text-decoration: none;
  border: none;
  font-size: inherit;
  border-radius: ${(props) => props.theme.grid.radius.small};
  cursor: pointer;
  background: none;
  color: ${(props) =>
    props.isOpen
      ? props.theme.colors.brand.medium
      : props.theme.colors.text.secondary};

  &:focus {
    outline: none;
  }

  &:hover {
    color: ${(props) => props.theme.colors.brand.medium};
  }

  ${DropdownToggle} {
    transform: ${(props) => (props.isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
  }

  ${(props) => props.isOpen && styledAvatar}
`
