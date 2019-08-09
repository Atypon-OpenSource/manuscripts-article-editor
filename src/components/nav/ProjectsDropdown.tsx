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

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Dropdown,
  DropdownButtonContainer,
  DropdownButtonText,
  DropdownContainer,
  NotificationsBadge,
} from './Dropdown'

export const ProjectsDropdown: React.FC<{
  notificationsCount: number
}> = ({ children, notificationsCount }) => {
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
      <DropdownButtonContainer
        onClick={toggleOpen}
        isOpen={open}
        className={'dropdown-toggle'}
      >
        <DropdownButtonText>Projects</DropdownButtonText>
        {notificationsCount > 0 && (
          <NotificationsBadge isOpen={open}>
            {notificationsCount}
          </NotificationsBadge>
        )}
      </DropdownButtonContainer>

      {open && <Dropdown style={{ width: 342, left: 20 }}>{children}</Dropdown>}
    </DropdownContainer>
  )
}
