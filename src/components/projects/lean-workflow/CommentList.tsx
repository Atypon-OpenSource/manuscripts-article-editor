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
} from '@manuscripts/manuscript-editor'
import {
  buildComment,
  buildContribution,
  buildKeyword,
} from '@manuscripts/manuscript-transform'
import {
  CommentAnnotation,
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
import { ContentNodeWithPos } from 'prosemirror-utils'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useCreateEditor } from '../../../hooks/use-create-editor'
import { useStore } from '../../../store'
import * as Pattern from '../CommentListPatterns'
import { HighlightedText } from '../HighlightedText'

interface Props {
  selected?: ContentNodeWithPos | null
  editor: ReturnType<typeof useCreateEditor>
}

export const CommentList: React.FC<Props> = React.memo(
  ({ selected, editor }) => {
    const [
      {
        comments = [],
        doc,
        user,
        collaborators,
        collaboratorsById,
        keywords,
        saveModel,
        deleteModel,
      },
    ] = useStore((store) => ({
      comments: store.comments,
      doc: store.doc,
      notes: store.notes,
      user: store.user,
      collaborators: store.collaborators || new Map<string, UserProfile>(),
      collaboratorsById: store.collaboratorsById,
      keywords: store.keywords,
      saveModel: store.saveModel,
      deleteModel: store.deleteModel,
    }))
    const { state, view } = editor

    const [newComment, setNewComment] = useState<CommentAnnotation>()
    const createKeyword = useCallback(
      (name: string) => saveModel(buildKeyword(name)),
      [saveModel]
    )
    const currentUser = useMemo(() => user, [user])
    const [commentTarget, setCommentTarget] = useState<string | undefined>()
    const [commentFilter, setCommentFilter] = useState<Pattern.CommentFilter>(
      Pattern.CommentFilter.ALL
    )

    useEffect(() => {
      if (commentTarget && !newComment) {
        const newComment = buildComment(commentTarget) as CommentAnnotation
        const contribution = buildContribution(currentUser._id)
        newComment.contributions = [contribution]

        const highlight = state && getHighlightTarget(newComment, state)

        if (highlight) {
          // newComment.originalText = getHighlightText(highlight, state)
          newComment.originalText = highlight.text
        }

        setNewComment(newComment)
      }
    }, [commentTarget, doc, newComment, state, currentUser])

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
              view && deleteHighlightMarkers(target)(view.state, view.dispatch)
            }

            if (newComment && newComment._id === id) {
              setCommentTarget(undefined)
            }
          })
      },
      [deleteModel, newComment, setCommentTarget, view]
    )

    const scrollIntoHighlight = (comment: CommentAnnotation) => {
      const el = document.querySelector(
        `[data-reference-id="${comment.target}"]`
      )
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        })
      }
    }

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
          const target = state && getHighlightTarget(comment, state)
          highlight = target // && getHighlightText(target, state)
        } catch (e) {
          highlight = null
        }

        return highlight ? '#ffe08b' : '#f9020287'
      },
      [state]
    )

    const can = usePermissions()

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
                        getCollaborator={(id) => collaboratorsById?.get(id)}
                        getKeyword={(id) => keywords.get(id)}
                        listCollaborators={() =>
                          Array.from(collaborators.values())
                        }
                        listKeywords={keywords}
                        saveComment={saveComment}
                        scrollIntoHighlight={scrollIntoHighlight}
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
                          onClick={scrollIntoHighlight}
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
                            getCollaborator={(id) => collaboratorsById?.get(id)}
                            getKeyword={(key: string) => keywords.get(key)}
                            isReply={true}
                            listCollaborators={() =>
                              Array.from(collaborators.values())
                            }
                            listKeywords={keywords}
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
