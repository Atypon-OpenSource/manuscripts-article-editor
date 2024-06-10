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
import { CommentAttrs } from '@manuscripts/body-editor'
import { Avatar, usePermissions } from '@manuscripts/style-guide'
import React, { useState } from 'react'
import styled from 'styled-components'

import { buildAuthorName, CommentTree, getAuthorID } from '../../lib/comments'
import { useStore } from '../../store'
import { CommentActions } from './CommentActions'
import { CommentBody } from './CommentBody'

const Container = styled.div<{ isSelected?: boolean }>`
  padding: 16px;
  background-color: ${(props) => (props.isSelected ? '#f2fbfc' : '#ffffff')};
  border: 1px solid ${(props) => (props.isSelected ? '#bce7f6' : '#e2e2e2')};
  border-left-width: 4px;
  margin-bottom: 16px;
`

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
`

const CommentMetadata = styled.div`
  flex: 1;
  padding-left: 8px;
  padding-right: 8px;
`

const CommentAuthor = styled.div`
  font-weight: 400;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CommentTarget = styled.div`
  font-size: 14px;
  color: #6e6e6e;
  background-color: #ffe08b;
  padding: 4px 8px;
  margin-top: 16px;
  margin-bottom: 16px;
`

export interface CommentThreadProps {
  tree: CommentTree
  isSelected: boolean
  onSelect: () => void
  onSave: (comment: CommentAttrs) => void
  onDelete: (id: string) => void
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  tree,
  isSelected,
  onSelect,
  onSave,
  onDelete,
}) => {
  const can = usePermissions()
  const [{ userID, collaboratorsById }] = useStore((state) => ({
    userID: state.userID,
    collaboratorsById: state.collaboratorsById,
  }))

  const authorID = getAuthorID(tree.comment)
  const authorName = authorID
    ? buildAuthorName(collaboratorsById.get(authorID))
    : ''

  const isResolveEnabled =
    authorID === userID ? can.resolveOwnComment : can.resolveOthersComment
  const isActionsEnabled =
    authorID === userID ? can.handleOwnComments : can.handleOthersComments

  const [isEditing, setEditing] = useState(false)

  const handleEdit = () => setEditing(true)

  const handleSave = (contents: string) => {
    onSave({
      ...tree.comment.node.attrs,
      contents,
    })
    setEditing(false)
  }

  const handleCancel = () => {
    setEditing(false)
  }

  const handleToggleResolve = () => {
    onSave({
      ...tree.comment.node.attrs,
      resolved: !tree.comment.node.attrs.resolved,
    })
  }

  return (
    <Container data-cy="comment" isSelected={isSelected}>
      <CommentHeader data-cy="comment-header">
        {authorName && <Avatar size={20} />}
        <CommentMetadata>
          <CommentAuthor>{authorName}</CommentAuthor>
          {/*<CreatedAt date={0} />*/}
        </CommentMetadata>
        <CommentActions
          comment={tree.comment}
          isResolveEnabled={isResolveEnabled}
          isActionsEnabled={isActionsEnabled}
          onDelete={() => onDelete(tree.comment.node.attrs.id)}
          onEdit={handleEdit}
          toggleResolve={handleToggleResolve}
        />
      </CommentHeader>
      {tree.comment.node.attrs.originalText && (
        <CommentTarget>{tree.comment.node.attrs.originalText}</CommentTarget>
      )}
      <CommentBody
        comment={tree.comment}
        isEditing={tree.isNew || isEditing}
        onSave={handleSave}
        onCancel={handleCancel}
        onSelect={onSelect}
      />
    </Container>
  )
}
