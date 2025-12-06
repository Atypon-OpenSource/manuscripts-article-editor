/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */

import { Comment } from '@manuscripts/body-editor'
import {
  DeleteIcon,
  DotsIcon,
  DropdownContainer,
  DropdownList,
  IconButton,
  useDropdown,
} from '@manuscripts/style-guide'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import { CommentResolveButton } from './CommentResolveButton'

export const ActionsIcon = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0 8px;
  margin-top: -8px;
  &:focus {
    outline: none;
  }
  &:hover svg circle,
  &:focus-visible svg circle {
    fill: #1a9bc7;
  }
`

export const CommentAction = styled.div`
  font-family: ${(props) => props.theme.font.family.Lato};
  cursor: pointer;
  font-size: 14px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.text.primary};
  padding: 6px 0 6px 8px;
  outline: none;
  
  &:hover,
  &:focus {
    background: #f2fbfc;
  }
`

const Container = styled.div`
  display: flex;
  align-items: end;
`

export interface CommentActionsProps {
  comment: Comment
  isResolveEnabled: boolean
  isActionsEnabled: boolean
  onEdit: () => void
  onDelete: () => void
  toggleResolve: () => void
}

export const CommentActions: React.FC<CommentActionsProps> = ({
  comment,
  isResolveEnabled,
  isActionsEnabled,
  onEdit,
  onDelete,
  toggleResolve,
}) => {
  const { isOpen, toggleOpen, wrapperRef } = useDropdown()
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => itemRefs.current[0]?.focus(), 0)
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[]
    if (items.length === 0) return

    const currentIndex = items.indexOf(document.activeElement as HTMLDivElement)
    if (currentIndex === -1) return
    e.preventDefault()
    e.stopPropagation()
    switch (e.key) {
      case 'ArrowDown':
        items[(currentIndex + 1) % items.length]?.focus()
        break
      case 'ArrowUp':
        items[(currentIndex - 1 + items.length) % items.length]?.focus()
        break
      case 'Escape':
        toggleOpen()
        wrapperRef.current?.querySelector('button')?.focus()
        break
      case 'Enter':
        (document.activeElement as HTMLElement)?.click()
        break
    }
  }

  return (
    <Container>
      {isActionsEnabled && (
        <DropdownContainer ref={wrapperRef}>
          <ActionsIcon
            data-cy="comment-dropdown-trigger"
            onClick={toggleOpen}
            className="actions-icon"
            aria-label="Comment Actions"
            tabIndex={0}
          >
            <DotsIcon />
          </ActionsIcon>
          {isOpen && (
            <DropdownList
              data-cy="comment-dropdown"
              direction={'right'}
              width={82}
              onClick={toggleOpen}
              onKeyDown={handleKeyDown}
              role="menu"
            >
              <CommentAction
                ref={(el) => (itemRefs.current[0] = el)}
                data-cy="comment-edit"
                onClick={onEdit}
                tabIndex={-1}
                role="menuitem"
              >
                Edit
              </CommentAction>
              <CommentAction
                ref={(el) => (itemRefs.current[1] = el)}
                className="delete-button"
                data-cy="comment-delete"
                onClick={onDelete}
                tabIndex={-1}
                role="menuitem"
              >
                Delete
              </CommentAction>
            </DropdownList>
          )}
        </DropdownContainer>
      )}
      {isResolveEnabled && (
        <CommentResolveButton comment={comment} onClick={toggleResolve} />
      )}
    </Container>
  )
}

export const OrphanCommentActions: React.FC<{
  onDelete: () => void
  isReply: boolean
  isOwn: boolean
}> = ({ onDelete, isReply, isOwn }) => {
  if (!isOwn || isReply) {
    return null
  }

  return (
    <Container>
      <IconButton
        className="delete-button"
        data-cy="orphan-comment-delete"
        onClick={onDelete}
        iconColor={'#333333'}
        tabIndex={0}
      >
        <DeleteIcon />
      </IconButton>
    </Container>
  )
}
