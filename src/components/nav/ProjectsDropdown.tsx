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
