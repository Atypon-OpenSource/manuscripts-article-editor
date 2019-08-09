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

import ArrowDownUp from '@manuscripts/assets/react/ArrowDownUp'
import { UserProfileWithAvatar } from '@manuscripts/manuscript-transform'
import { Avatar } from '@manuscripts/style-guide'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { styled } from '../../theme/styled-components'
import { Dropdown, DropdownContainer } from './Dropdown'

export const ProfileDropdown: React.FC<{
  user: UserProfileWithAvatar
}> = ({ children, user }) => {
  const [open, setOpen] = useState(false)

  const nodeRef = useRef<HTMLDivElement>(null)

  const toggleOpen = useCallback(() => {
    setOpen(value => !value)
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
  }, [open])

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
        <Dropdown style={{ right: 0, left: 'auto' }}>{children}</Dropdown>
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

const DropdownButton = styled.button<{
  isOpen: boolean
}>`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  text-decoration: none;
  border: none;
  font-size: inherit;
  border-radius: 4px;
  cursor: pointer;
  background: none;
  color: ${props =>
    props.isOpen
      ? props.theme.colors.profile.avatar.hovered
      : props.theme.colors.profile.avatar.default};

  &:focus {
    outline: none;
  }

  &:hover {
    color: ${props => props.theme.colors.profile.avatar.hovered};
  }

  ${DropdownToggle} {
    transform: ${props => (props.isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
  }
`
