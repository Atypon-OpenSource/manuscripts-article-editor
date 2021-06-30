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
} from '@manuscripts/manuscript-editor'
import {
  buildComment,
  buildContribution,
  ManuscriptNode,
  Selected,
} from '@manuscripts/manuscript-transform'
import {
  CommentAnnotation,
  Keyword,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import {
  buildCommentTree,
  CommentData,
  CommentTarget,
  CommentWrapper,
  NoteBodyContainer,
  ReplyBodyContainer,
  usePermissions,
} from '@manuscripts/style-guide'
import { EditorState, Transaction } from 'prosemirror-state'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import * as Pattern from './CommentListPatterns'
import { HighlightedText } from './HighlightedText'

interface Props {
  comments: CommentAnnotation[]
  createKeyword: (name: string) => Promise<Keyword>
  saveModel: (model: CommentAnnotation) => Promise<CommentAnnotation>
  deleteModel: (id: string) => Promise<string>
  doc: ManuscriptNode
  getCollaborator: (id: string) => UserProfile | undefined
  getCollaboratorById: (id: string) => UserProfile | undefined
  getCurrentUser: () => UserProfile
  getKeyword: (id: string) => Keyword | undefined
  listCollaborators: () => UserProfile[]
  listKeywords: () => Keyword[]
  selected: Selected | null
  commentTarget?: string
  setCommentTarget: (commentTarget?: string) => void
  state: EditorState
  dispatch: (tr: Transaction) => EditorState | void
  setCommentFilter: (selectResolved: Pattern.CommentFilter) => void
  commentFilter: Pattern.CommentFilter
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
    getCollaboratorById,
    getKeyword,
    listCollaborators,
    listKeywords,
    commentTarget,
    setCommentTarget,
    state,
    dispatch,
    setCommentFilter,
    commentFilter,
  }) => {
    const [newComment, setNewComment] = useState<CommentAnnotation>()

    const currentUser = useMemo(() => getCurrentUser(), [getCurrentUser])

    useEffect(() => {
      if (commentTarget && !newComment) {
        const newComment = buildComment(commentTarget) as CommentAnnotation
        const contribution = buildContribution(currentUser._id)
        newComment.contributions = [contribution]

        const highlight = getHighlightTarget(newComment, state)

        if (highlight) {
          newComment.originalText = getHighlightText(highlight, state)
        }

        setNewComment(newComment)
      }
    }, [commentTarget, getCurrentUser, doc, newComment, state, currentUser])

    const items = useMemo<Array<[string, CommentData[]]>>(() => {
      const combinedComments = [...comments]

      if (newComment) {
        combinedComments.push(newComment)
      }

      const commentsTreeMap = buildCommentTree(doc, combinedComments)

      return Array.from(commentsTreeMap.entries())
    }, [comments, newComment, doc])

    const saveComment = useCallback(
      (comment: CommentAnnotation) => {
        return saveModel(comment).then((comment) => {
          if (newComment && newComment._id === comment._id) {
            setCommentTarget(undefined)
          }

          return comment
        })
      },
      [newComment, setCommentTarget, saveModel]
    )

    const deleteComment = useCallback(
      (id: string, target?: string) => {
        return deleteModel(id)
          .catch((error: Error) => {
            console.error(error)
          })
          .then(async () => {
            if (target && target.startsWith('MPHighlight:')) {
              await deleteModel(target)
            }
          })
          .catch((error: Error) => {
            console.error(error)
          })
          .finally(() => {
            if (target && target.startsWith('MPHighlight:')) {
              deleteHighlightMarkers(target, state, dispatch)
            }

            if (newComment && newComment._id === id) {
              setCommentTarget(undefined)
            }
          })
      },
      [deleteModel, newComment, setCommentTarget, state, dispatch]
    )

    const isNew = useCallback(
      (comment: CommentAnnotation): boolean => {
        return newComment ? newComment._id === comment._id : false
      },
      [newComment]
    )

    const getHighlightTextColor = useCallback(
      (comment: CommentAnnotation) => {
        let highlight = null
        try {
          const target = getHighlightTarget(comment, state)
          highlight = target && getHighlightText(target, state)
        } catch (e) {
          highlight = null
        }

        return highlight ? '#ffe08b' : '#f9020287'
      },
      [state]
    )

    const can = usePermissions()

    if (!items.length) {
      ;<Pattern.EmptyCommentsListPlaceholder />
    }

    return (
      <React.Fragment>
        <Pattern.SeeResolvedCheckbox
          isEmpty={!items.length}
          commentFilter={commentFilter}
          setCommentFilter={setCommentFilter}
        />
        <Pattern.Container>
          {items.map(([target, commentData]) => {
            // TODO: move this into a child component?
            const isSelected =
              (selected &&
                (selected.node.attrs.id === target ||
                  selected.node.attrs.rid === target)) ||
              false
            const selectedNoteData =
              commentFilter === Pattern.CommentFilter.ALL
                ? commentData
                : commentData.filter((note) => !note.comment.resolved)
            return (
              <CommentTarget key={target} isSelected={isSelected}>
                {selectedNoteData.map(({ comment, children }) => (
                  <Pattern.Thread key={comment._id}>
                    <NoteBodyContainer
                      isSelected={isSelected}
                      isNew={isNew(comment as CommentAnnotation)}
                    >
                      <CommentWrapper
                        comment={comment}
                        createKeyword={createKeyword}
                        deleteComment={deleteComment}
                        getCollaborator={getCollaboratorById}
                        getKeyword={getKeyword}
                        listCollaborators={listCollaborators}
                        listKeywords={listKeywords}
                        saveComment={saveComment}
                        handleCreateReply={setCommentTarget}
                        can={can}
                        currentUserId={currentUser._id}
                        handleSetResolved={async () =>
                          await saveModel({
                            ...comment,
                            resolved: !comment.resolved,
                          } as CommentAnnotation)
                        }
                        isNew={isNew(comment as CommentAnnotation)}
                      >
                        <HighlightedText
                          comment={comment as CommentAnnotation}
                          getHighlightTextColor={getHighlightTextColor}
                        />
                      </CommentWrapper>
                    </NoteBodyContainer>

                    {children.map((comment) => (
                      <Pattern.Reply key={comment._id}>
                        <ReplyBodyContainer>
                          <CommentWrapper
                            comment={comment}
                            createKeyword={createKeyword}
                            deleteComment={deleteComment}
                            getCollaborator={getCollaboratorById}
                            getKeyword={getKeyword}
                            isReply={true}
                            listCollaborators={listCollaborators}
                            listKeywords={listKeywords}
                            saveComment={saveComment}
                            handleCreateReply={setCommentTarget}
                            can={can}
                            currentUserId={currentUser._id}
                            isNew={isNew(comment as CommentAnnotation)}
                          />
                        </ReplyBodyContainer>
                      </Pattern.Reply>
                    ))}
                  </Pattern.Thread>
                ))}
              </CommentTarget>
            )
          })}
        </Pattern.Container>
      </React.Fragment>
    )
  }
)
