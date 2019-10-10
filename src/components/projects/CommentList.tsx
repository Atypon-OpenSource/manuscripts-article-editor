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
  deleteHighlightMarkers,
  getHighlightTarget,
  getHighlightText,
  selectedHighlights,
} from '@manuscripts/manuscript-editor'
import {
  buildComment,
  CommentAnnotation,
  ManuscriptEditorView,
  ManuscriptNode,
  Selected,
} from '@manuscripts/manuscript-transform'
import { Keyword, UserProfile } from '@manuscripts/manuscripts-json-schema'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { buildCommentTree, CommentData } from '../../lib/comments'
import { styled } from '../../theme/styled-components'
import { RelativeDate } from '../RelativeDate'
import CommentBody from './CommentBody'
import { CommentTarget } from './CommentTarget'
import { CommentUser } from './CommentUser'
import { HighlightedText } from './HighlightedText'

const CommentListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`

const Container = styled.div<{
  isSelected: boolean
}>`
  padding: ${props => props.theme.grid.unit * 4}px 0
    ${props => props.theme.grid.unit * 2}px;
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.brand.xlight};
  border-left: 4px solid
    ${props =>
      props.isSelected
        ? props.theme.colors.border.warning
        : props.theme.colors.brand.light};
`

const CommentThread = styled.div`
  margin: 16px 16px 16px 0;
`

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${props => props.theme.font.size.normal};
  margin-bottom: 16px;
  padding: 0 16px;
`

const Reply = styled.div`
  padding: ${props => props.theme.grid.unit * 4}px 0
    ${props => props.theme.grid.unit * 2}px;
  margin-left: ${props => props.theme.grid.unit * 4}px;
  border: 1px solid ${props => props.theme.colors.brand.xlight};
  border-top: none;
`

const LightRelativeDate = styled(RelativeDate)`
  font-size: ${props => props.theme.font.size.small};
  color: ${props => props.theme.colors.text.secondary};
  letter-spacing: -0.2px;
`

interface Props {
  comments: CommentAnnotation[]
  createKeyword: (name: string) => Promise<Keyword>
  saveModel: (model: CommentAnnotation) => Promise<CommentAnnotation>
  deleteModel: (id: string) => Promise<string>
  doc: ManuscriptNode
  getCollaborator: (id: string) => UserProfile | undefined
  getCurrentUser: () => UserProfile
  getKeyword: (id: string) => Keyword | undefined
  listCollaborators: () => UserProfile[]
  listKeywords: () => Keyword[]
  selected: Selected | null
  commentTarget?: string
  setCommentTarget: (commentTarget?: string) => void
  view: ManuscriptEditorView
}

export const CommentList: React.FC<Props> = React.memo(
  ({
    comments,
    deleteModel,
    doc,
    getCurrentUser,
    saveModel,
    selected,
    createKeyword,
    getCollaborator,
    getKeyword,
    listCollaborators,
    listKeywords,
    commentTarget,
    setCommentTarget,
    view,
  }) => {
    const [newComment, setNewComment] = useState<CommentAnnotation>()

    const { dispatch, state } = view

    useEffect(() => {
      if (commentTarget && !newComment) {
        const currentUser = getCurrentUser()

        const newComment = buildComment(
          currentUser.userID,
          commentTarget
        ) as CommentAnnotation

        const highlight = getHighlightTarget(newComment, state)

        if (highlight) {
          newComment.originalText = getHighlightText(highlight, state)
        }

        setNewComment(newComment)
      }
    }, [commentTarget, getCurrentUser, doc, newComment, state])

    const items = useMemo<Array<[string, CommentData[]]>>(() => {
      const combinedComments = [...comments]

      if (newComment) {
        combinedComments.push(newComment)
      }

      const commentsTreeMap = buildCommentTree(doc, combinedComments)

      return Array.from(commentsTreeMap.entries())
    }, [comments, newComment, doc])

    const highlights = useMemo(() => selectedHighlights(state), [state])

    const saveComment = useCallback(
      (comment: CommentAnnotation) => {
        return saveModel(comment).then(comment => {
          if (newComment && newComment._id === comment._id) {
            setCommentTarget(undefined)
          }

          return comment
        })
      },
      [newComment, setCommentTarget, saveModel]
    )

    const deleteComment = useCallback(
      (comment: CommentAnnotation) => {
        return deleteModel(comment._id)
          .catch((error: Error) => {
            console.error(error) // tslint:disable-line:no-console
          })
          .then(async () => {
            if (comment.target.startsWith('MPHighlight:')) {
              await deleteModel(comment.target)
            }
          })
          .catch((error: Error) => {
            console.error(error) // tslint:disable-line:no-console
          })
          .finally(() => {
            if (comment.target.startsWith('MPHighlight:')) {
              deleteHighlightMarkers(comment.target, state, dispatch)
            }

            if (newComment && newComment._id === comment._id) {
              setCommentTarget(undefined)
            }
          })
      },
      [
        deleteModel,
        deleteHighlightMarkers,
        newComment,
        setCommentTarget,
        state,
        dispatch,
      ]
    )

    const isNew = useCallback(
      (comment: CommentAnnotation): boolean => {
        return newComment ? newComment._id === comment._id : false
      },
      [newComment]
    )

    if (!items) {
      return null
    }

    return (
      <CommentListContainer>
        {items.map(([target, commentData]) => {
          // TODO: move this into a child component?
          const isSelected =
            (selected &&
              (selected.node.attrs.id === target ||
                selected.node.attrs.rid === target)) ||
            highlights.some(highlight => highlight.rid === target)

          return (
            <CommentTarget key={target} isSelected={isSelected}>
              {commentData.map(({ comment, children }) => (
                <CommentThread key={comment._id}>
                  <Container isSelected={isSelected}>
                    <CommentHeader>
                      <CommentUser
                        getCollaborator={getCollaborator}
                        userID={comment.userID}
                      />
                      <LightRelativeDate createdAt={comment.createdAt} />
                    </CommentHeader>

                    <HighlightedText comment={comment} state={state} />

                    <CommentBody
                      comment={comment}
                      createKeyword={createKeyword}
                      deleteComment={deleteComment}
                      getCollaborator={getCollaborator}
                      getKeyword={getKeyword}
                      listCollaborators={listCollaborators}
                      listKeywords={listKeywords}
                      saveComment={saveComment}
                      setCommentTarget={setCommentTarget}
                      isNew={isNew(comment)}
                    />
                  </Container>

                  {children.map(comment => (
                    <Reply key={comment._id}>
                      <CommentHeader>
                        <CommentUser
                          getCollaborator={getCollaborator}
                          userID={comment.userID}
                        />
                        <LightRelativeDate createdAt={comment.createdAt} />
                      </CommentHeader>

                      <CommentBody
                        comment={comment}
                        createKeyword={createKeyword}
                        deleteComment={deleteComment}
                        getCollaborator={getCollaborator}
                        getKeyword={getKeyword}
                        isReply={true}
                        listCollaborators={listCollaborators}
                        listKeywords={listKeywords}
                        saveComment={saveComment}
                        setCommentTarget={setCommentTarget}
                        isNew={isNew(comment)}
                      />
                    </Reply>
                  ))}
                </CommentThread>
              ))}
            </CommentTarget>
          )
        })}
      </CommentListContainer>
    )
  }
)
