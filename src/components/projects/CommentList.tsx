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
  deleteHighlightMarkers,
  getHighlightTarget,
  getHighlightText,
  selectedHighlights,
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
  CheckboxField,
  CheckboxLabel,
  CommentData,
  CommentTarget,
  CommentWrapper,
  NoteBodyContainer,
  ReplyBodyContainer,
} from '@manuscripts/style-guide'
import { EditorState, Transaction } from 'prosemirror-state'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { HighlightedText } from './HighlightedText'

const CommentListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`

const CommentThread = styled.div`
  margin: 16px 16px 16px 0;
`

const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`

const PlaceholderMessage = styled.div`
  font-size: ${(props) => props.theme.font.size.medium};
  font-weight: ${(props) => props.theme.font.weight.light};
  color: ${(props) => props.theme.colors.text.secondary};
  text-align: center;
  margin: ${(props) => props.theme.grid.unit * 5}px;
`

export enum CommentFilter {
  ALL,
  RESOLVED,
}

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
  setCommentFilter: (selectResolved: CommentFilter) => void
  commentFilter: CommentFilter
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

    useEffect(() => {
      if (commentTarget && !newComment) {
        const newComment = buildComment(commentTarget) as CommentAnnotation

        const currentUser = getCurrentUser()
        const contribution = buildContribution(currentUser._id)
        newComment.contributions = [contribution]

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

      if (newComment && commentsTreeMap.get(newComment.target)) {
        setCommentFilter(CommentFilter.ALL)
      }

      return Array.from(commentsTreeMap.entries())
    }, [comments, newComment, doc, setCommentFilter])

    const highlights = useMemo(() => selectedHighlights(state), [state])

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
            if (target?.startsWith('MPHighlight:')) {
              await deleteModel(target)
            }
          })
          .catch((error: Error) => {
            console.error(error)
          })
          .finally(() => {
            if (target?.startsWith('MPHighlight:')) {
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

    const handleOnSelectChange = useCallback(
      (e) =>
        setCommentFilter(
          e.target.checked ? CommentFilter.RESOLVED : CommentFilter.ALL
        ),
      [setCommentFilter]
    )

    if (!items.length) {
      return (
        <PlaceholderContainer>
          <AuthorPlaceholder width={295} height={202} />
          <PlaceholderMessage>
            Discuss this manuscript with your collaborators by creating a
            comment.
          </PlaceholderMessage>
        </PlaceholderContainer>
      )
    }

    return (
      <>
        <ActionHeader>
          {items.length > 0 && (
            <Checkbox>
              <CheckboxField
                checked={commentFilter === CommentFilter.RESOLVED}
                onChange={handleOnSelectChange}
              />
              <LabelText>See resolved</LabelText>
            </Checkbox>
          )}
        </ActionHeader>
        <CommentListContainer>
          {items.map(([target, commentData]) => {
            // TODO: move this into a child component?
            const isSelected =
              (selected &&
                (selected.node.attrs.id === target ||
                  selected.node.attrs.rid === target)) ||
              highlights.some((highlight) => highlight.rid === target)
            const selectedNoteData =
              commentFilter === CommentFilter.RESOLVED
                ? commentData.filter((note) => note.comment.resolved)
                : commentData
            return (
              <CommentTarget key={target} isSelected={isSelected}>
                {selectedNoteData.map(({ comment, children }) => (
                  <CommentThread key={comment._id}>
                    <NoteBodyContainer
                      isSelected={isSelected}
                      isNew={isNew(comment as CommentAnnotation)}
                    >
                      <CommentWrapper
                        createKeyword={createKeyword}
                        comment={comment}
                        deleteComment={deleteComment}
                        resolvedCallback={async () =>
                          await saveModel({
                            ...comment,
                            resolved: !comment.resolved,
                          } as CommentAnnotation)
                        }
                        getCollaborator={getCollaboratorById}
                        getKeyword={getKeyword}
                        listCollaborators={listCollaborators}
                        listKeywords={listKeywords}
                        saveComment={saveComment}
                        setCommentTarget={setCommentTarget}
                        isNew={isNew(comment as CommentAnnotation)}
                      >
                        <HighlightedText
                          comment={comment as CommentAnnotation}
                          state={state}
                        />
                      </CommentWrapper>
                    </NoteBodyContainer>

                    {children.map((comment) => (
                      <ReplyBodyContainer key={comment._id}>
                        <CommentWrapper
                          createKeyword={createKeyword}
                          comment={comment}
                          deleteComment={deleteComment}
                          getCollaborator={getCollaboratorById}
                          getKeyword={getKeyword}
                          isReply={true}
                          listCollaborators={listCollaborators}
                          listKeywords={listKeywords}
                          saveComment={saveComment}
                          setCommentTarget={setCommentTarget}
                          isNew={isNew(comment as CommentAnnotation)}
                        />
                      </ReplyBodyContainer>
                    ))}
                  </CommentThread>
                ))}
              </CommentTarget>
            )
          })}
        </CommentListContainer>
      </>
    )
  }
)

const ActionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 17px;
  margin-left: 33px;
`

export const LabelText = styled.div`
  font-family: ${(props) => props.theme.font.family.sans};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 14px;
  line-height: 24px;
`

const Checkbox = styled(CheckboxLabel)`
  div {
    color: ${(props) => props.theme.colors.text.primary};
  }
`
