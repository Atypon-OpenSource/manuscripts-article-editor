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

import AuthorPlaceholder from '@manuscripts/assets/react/AuthorPlaceholder'
import {
  CommentAnnotation,
  Keyword,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import { CommentTarget, CommentWrapper } from '@manuscripts/style-guide'
import React from 'react'

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
  getCollaborator: (id: string) => UserProfile | undefined
  getKeyword: (id: string) => Keyword | undefined
  listCollaborators: () => UserProfile[]
  listKeywords: () => Keyword[]
  commentController: ReturnType<typeof useComments>
}

export const CommentsList: React.FC<Props> = ({
  createKeyword,
  getCollaborator,
  getKeyword,
  listCollaborators,
  listKeywords,
  commentController,
}) => {
  const {
    items,
    saveComment,
    deleteComment,
    handleCreateReply,
  } = commentController

  const getHighlightTextColor = (comment: CommentAnnotation) =>
    comment.annotationColor || 'rgb(250, 244, 150)'

  const threads = topLevelComments(items)

  if (!threads.length) {
    return (
      <Pattern.PlaceholderContainer>
        <AuthorPlaceholder width={295} height={202} />
        <Pattern.PlaceholderMessage>
          Discuss this manuscript with your collaborators by creating a comment.
        </Pattern.PlaceholderMessage>
      </Pattern.PlaceholderContainer>
    )
  }

  return (
    <Pattern.Container>
      {threads.map(({ comment }) => {
        return (
          <CommentTarget key={comment._id} isSelected={false}>
            <Pattern.Thread key={comment._id}>
              <CommentWrapper
                comment={comment as CommentAnnotation}
                createKeyword={createKeyword}
                deleteComment={deleteComment}
                getCollaborator={getCollaborator}
                getKeyword={getKeyword}
                listCollaborators={listCollaborators}
                listKeywords={listKeywords}
                saveComment={saveComment}
                handleCreateReply={handleCreateReply}
                isNew={!isSavedComment(comment)}
              >
                <HighlightedText
                  comment={comment as CommentAnnotation}
                  getHighlightTextColor={getHighlightTextColor}
                />
              </CommentWrapper>

              {repliesOf(items, comment._id).map(({ comment: reply }) => (
                <Pattern.Reply key={reply._id}>
                  <CommentWrapper
                    isReply={true}
                    comment={reply as CommentAnnotation}
                    createKeyword={createKeyword}
                    deleteComment={deleteComment}
                    getCollaborator={getCollaborator}
                    getKeyword={getKeyword}
                    listCollaborators={listCollaborators}
                    listKeywords={listKeywords}
                    saveComment={saveComment}
                    handleCreateReply={handleCreateReply}
                    isNew={!isSavedComment(reply)}
                  />
                </Pattern.Reply>
              ))}
            </Pattern.Thread>
          </CommentTarget>
        )
      })}
    </Pattern.Container>
  )
}
