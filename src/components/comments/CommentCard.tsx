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
import { Comment, CommentAttrs } from '@manuscripts/body-editor'
import {
  AvatarIcon,
  RelativeDate,
  SystemUserAvatarIcon,
  usePermissions,
} from '@manuscripts/style-guide'
import React, { useState } from 'react'
import styled from 'styled-components'

import { buildAuthorName, getAuthorID } from '../../lib/comments'
import { useStore } from '../../store'
import { CommentActions } from './CommentActions'
import { CommentBody } from './CommentBody'
import { DeleteCommentConfirmation } from './DeleteCommentConfirmation'

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`

const CommentMetadata = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;
`

const AuthorContainer = styled.div`
  display: flex;
  color: #353535;
  font-weight: 400;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  flex-grow: 1;
  text-overflow: ellipsis;
  margin-right: 8px;

  svg {
    padding-right: 10px;
    flex-shrink: 0;
  }
`
const CommentTarget = styled.div`
  font-size: 14px;
  color: #353535;
  background-color: #ffeebf;
  padding: 4px 8px;
  margin-top: 16px;
  margin-bottom: 16px;
`

const Timestamp = styled(RelativeDate)`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  color: #6e6e6e;
  white-space: nowrap;
  padding-right: 8px;
`
const RepliesCount = styled.div.attrs({
  'data-cy': 'reply-count',
})`
  border-radius: 50%;
  width: 12px;
  height: 12px;
  color: #ffffff;
  background-color: #1a9bc7;
  text-align: center;
  font-size: 9px;
`
const Card = styled.div`
  position: relative;
`

interface CommentCardProps {
  comment: Comment
  isReply: boolean
  numOfReplies: number
  isNew: boolean
  isEndOfThread: boolean
  editingCommentId: string | null
  setEditingCommentId: (id: string | null) => void
  onSave: (comment: CommentAttrs) => void
  onDelete: (id: string) => void
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  isReply,
  numOfReplies,
  isNew,
  isEndOfThread,
  editingCommentId,
  setEditingCommentId,
  onSave,
  onDelete,
}) => {
  const can = usePermissions()
  const [{ user, collaboratorsById }] = useStore((state) => ({
    user: state.user,
    collaboratorsById: state.collaboratorsById,
  }))

  const authorID = getAuthorID(comment)
  const authorName = authorID
    ? buildAuthorName(collaboratorsById.get(authorID))
    : ''

  const timestamp = comment.node.attrs.contributions?.[0].timestamp

  const isOwn = authorID === user._id

  const isResolveEnabled = isOwn
    ? can.resolveOwnComment
    : can.resolveOthersComment

  const isActionsEnabled = isOwn
    ? can.handleOwnComments
    : can.handleOthersComments

  const commentID = comment.node.attrs.id
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const handleEdit = () => {
    setEditingCommentId(commentID)
  }
  const handleSave = (contents: string) => {
    onSave({
      ...comment.node.attrs,
      contents,
    })
    setEditingCommentId(null)
  }

  const handleCancel = () => {
    setEditingCommentId(null)
    if (isNew) {
      onDelete(commentID)
    }
  }

  const handleToggleResolve = () => {
    onSave({
      ...comment.node.attrs,
      resolved: !comment.node.attrs.resolved,
    })
  }

  const handleDelete = () => {
    setShowDeleteConfirmation(true)
  }

  const confirmDelete = () => {
    onDelete(commentID)
    setShowDeleteConfirmation(false)
  }

  const cancelDelete = () => {
    setShowDeleteConfirmation(false)
  }

  return (
    <Card>
      <CommentHeader data-cy="comment-header">
        <CommentMetadata>
          <AuthorContainer>
            {authorName ? (
              <>
                <AvatarIcon width={20} height={20} />
                <>{authorName}</>
              </>
            ) : (
              !isReply && (
                <>
                  <SystemUserAvatarIcon width={20} height={20} />
                  <>System</>
                </>
              )
            )}
          </AuthorContainer>
          {timestamp && <Timestamp date={timestamp * 1000} />}
          {numOfReplies !== 0 && <RepliesCount> {numOfReplies} </RepliesCount>}
        </CommentMetadata>
        <CommentActions
          comment={comment}
          isResolveEnabled={isResolveEnabled && !isReply}
          isActionsEnabled={isActionsEnabled && isEndOfThread}
          onDelete={handleDelete}
          onEdit={handleEdit}
          toggleResolve={handleToggleResolve}
        />
      </CommentHeader>
      {comment.node.attrs.originalText && (
        <CommentTarget>{comment.node.attrs.originalText}</CommentTarget>
      )}
      <CommentBody
        comment={comment}
        isEditing={editingCommentId === commentID}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      {showDeleteConfirmation && (
        <DeleteCommentConfirmation
          isReply={isReply}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </Card>
  )
}
