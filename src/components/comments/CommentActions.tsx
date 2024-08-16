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
  DotsIcon,
  DropdownContainer,
  DropdownList,
  useDropdown,
} from '@manuscripts/style-guide'
import React from 'react'
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
  &:hover svg circle {
    fill: #1a9bc7;
  }
`

export const CommentAction = styled.div`
  font-family: ${(props) => props.theme.font.family.Lato};
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.text.primary};
  padding: 16px;
  &:hover,
  &:focus {
    background: #f2fbfc;
  }
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

  return (
    <>
      {isResolveEnabled && (
        <CommentResolveButton comment={comment} onClick={toggleResolve} />
      )}
      {isActionsEnabled && (
        <DropdownContainer ref={wrapperRef}>
          <ActionsIcon data-cy="comment-dropdown-trigger" onClick={toggleOpen}>
            <DotsIcon />
          </ActionsIcon>
          {isOpen && (
            <DropdownList
              data-cy="comment-dropdown"
              direction={'right'}
              width={125}
              onClick={toggleOpen}
            >
              <CommentAction data-cy="comment-edit" onClick={onEdit}>
                Edit
              </CommentAction>
              <CommentAction data-cy="comment-delete" onClick={onDelete}>
                Delete
              </CommentAction>
            </DropdownList>
          )}
        </DropdownContainer>
      )}
    </>
  )
}
