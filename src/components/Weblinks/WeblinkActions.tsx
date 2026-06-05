/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2026 Atypon Systems LLC. All Rights Reserved.
 */

import { DotsIcon, DropdownContainer, useDropdown } from '@manuscripts/style-guide'
import React, { useEffect, useRef } from 'react'

import {
  ActionsIcon,
  FileAction,
  FileActionDropdownList,
} from '../FileManager/FileActions'

export const WeblinkActions: React.FC<{
  onEdit: () => void
  onDelete: () => void
}> = ({ onEdit, onDelete }) => {
  const { isOpen, toggleOpen, wrapperRef } = useDropdown()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const editRef = useRef<HTMLButtonElement>(null)
  const deleteRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        toggleOpen()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, wrapperRef, toggleOpen])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => editRef.current?.focus(), 0)
    }
  }, [isOpen])

  const closeDropdown = () => {
    toggleOpen()
    triggerRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = [editRef.current, deleteRef.current].filter(Boolean)
    if (items.length === 0) {
      return
    }

    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    if (index < 0) {
      return
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        closeDropdown()
        break
      case 'ArrowDown':
        e.preventDefault()
        items[(index + 1) % items.length]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        items[(index - 1 + items.length) % items.length]?.focus()
        break
    }
  }

  return (
    <DropdownContainer ref={wrapperRef}>
      <ActionsIcon
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation()
          toggleOpen()
        }}
        type="button"
        className="show-on-hover"
        data-cy="file-actions"
        aria-label="Weblink actions"
        aria-pressed={isOpen}
      >
        <DotsIcon />
      </ActionsIcon>
      {isOpen && (
        <FileActionDropdownList
          data-cy="file-actions-dropdown"
          direction="right"
          width={120}
          top={5}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          <FileAction
            data-cy="weblink-edit"
            ref={editRef}
            onClick={(e) => {
              e.stopPropagation()
              closeDropdown()
              onEdit()
            }}
          >
            Edit
          </FileAction>
          <FileAction
            data-cy="weblink-delete"
            ref={deleteRef}
            onClick={(e) => {
              e.stopPropagation()
              closeDropdown()
              onDelete()
            }}
          >
            Delete
          </FileAction>
        </FileActionDropdownList>
      )}
    </DropdownContainer>
  )
}
