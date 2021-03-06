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

import {
  CommentAnnotation,
  Keyword,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import {
  CommentWrapper,
  NoteBodyContainer,
  ReplyBodyContainer,
  usePermissions,
} from '@manuscripts/style-guide'
import React, { useState } from 'react'

import {
  isSavedComment,
  repliesOf,
  topLevelComments,
  useComments,
} from '../../../hooks/use-comments'
import * as Pattern from '../CommentListPatterns'
import { HighlightedText } from '../HighlightedText'

interface Props {
  createKeyword: (name: string) => Promise<Keyword>
  getCollaboratorById: (id: string) => UserProfile | undefined
  getKeyword: (id: string) => Keyword | undefined
  listCollaborators: () => UserProfile[]
  listKeywords: () => Keyword[]
  commentController: ReturnType<typeof useComments>
}

export const CommentsList: React.FC<Props> = ({
  createKeyword,
  getCollaboratorById,
  getKeyword,
  listCollaborators,
  listKeywords,
  commentController,
}) => {
  const [commentFilter, setCommentFilter] = useState<Pattern.CommentFilter>(
    Pattern.CommentFilter.UNRESOLVED
  )
  const can = usePermissions()
  const {
    items,
    focusedItem,
    saveComment,
    deleteComment,
    handleCreateReply,
    handleRequestSelect,
  } = commentController

  const getHighlightTextColor = (comment: CommentAnnotation) =>
    comment.annotationColor || 'rgb(250, 244, 150)'

  const threads = topLevelComments(items, commentFilter)

  if (!items.length) {
    return <Pattern.EmptyCommentsListPlaceholder />
  }

  return (
    <React.Fragment>
      <Pattern.SeeResolvedCheckbox
        isEmpty={!items.length}
        commentFilter={commentFilter}
        setCommentFilter={setCommentFilter}
      />
      <Pattern.Container>
        {threads.map(({ comment }) => {
          return (
            <Pattern.Thread key={comment._id}>
              <NoteBodyContainer
                isSelected={focusedItem === comment.target}
                isNew={!isSavedComment(comment)}
              >
                <CommentWrapper
                  comment={comment as CommentAnnotation}
                  createKeyword={createKeyword}
                  deleteComment={deleteComment}
                  getCollaborator={getCollaboratorById}
                  getKeyword={getKeyword}
                  listCollaborators={listCollaborators}
                  listKeywords={listKeywords}
                  saveComment={saveComment}
                  handleCreateReply={handleCreateReply}
                  isNew={!isSavedComment(comment)}
                  isSelected={focusedItem === comment.target}
                  can={can}
                  handleRequestSelect={() =>
                    handleRequestSelect(comment.target)
                  }
                  scrollIntoHighlight={(comment) => {
                    handleRequestSelect(comment.target)
                  }}
                  handleSetResolved={() => {
                    saveComment({
                      ...comment,
                      resolved: !comment.resolved,
                    })
                  }}
                >
                  <HighlightedText
                    comment={comment as CommentAnnotation}
                    getHighlightTextColor={getHighlightTextColor}
                  />
                </CommentWrapper>
              </NoteBodyContainer>

              {repliesOf(items, comment._id).map(({ comment: reply }) => (
                <ReplyBodyContainer key={reply._id}>
                  <CommentWrapper
                    isReply={true}
                    comment={reply as CommentAnnotation}
                    createKeyword={createKeyword}
                    deleteComment={deleteComment}
                    getCollaborator={getCollaboratorById}
                    getKeyword={getKeyword}
                    listCollaborators={listCollaborators}
                    listKeywords={listKeywords}
                    saveComment={saveComment}
                    handleCreateReply={handleCreateReply}
                    isNew={!isSavedComment(reply)}
                    can={can}
                  />
                </ReplyBodyContainer>
              ))}
            </Pattern.Thread>
          )
        })}
      </Pattern.Container>
    </React.Fragment>
  )
}
