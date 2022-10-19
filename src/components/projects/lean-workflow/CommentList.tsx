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
  updateCommentAnnotationState,
} from '@manuscripts/manuscript-editor'
import {
  buildComment,
  buildContribution,
  buildKeyword,
  getModelsByType,
} from '@manuscripts/manuscript-transform'
import {
  CommentAnnotation,
  ElementsOrder,
  ObjectTypes,
  UserProfile,
} from '@manuscripts/manuscripts-json-schema'
import {
  buildCommentTree,
  CommentData,
  CommentTarget,
  CommentType,
  CommentWrapper,
  NoteBodyContainer,
  ReplyBodyContainer,
  usePermissions,
} from '@manuscripts/style-guide'
import { ContentNodeWithPos } from 'prosemirror-utils'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useCreateEditor } from '../../../hooks/use-create-editor'
import { useDocStore } from '../../../quarterback/useDocStore'
import { useStore } from '../../../store'
import * as Pattern from '../CommentListPatterns'
import { HighlightedText } from '../HighlightedText'

interface Props {
  selected?: ContentNodeWithPos | null
  editor: ReturnType<typeof useCreateEditor>
}

export const CommentList: React.FC<Props> = ({ selected, editor }) => {
  const [
    {
      comments = [],
      commentTarget,
      doc,
      user,
      collaborators,
      collaboratorsById,
      keywords,
      manuscriptID,
      modelMap,
      saveModel,
      deleteModel,
    },
    dispatch,
  ] = useStore((store) => ({
    comments: store.comments,
    doc: store.doc,
    notes: store.notes,
    user: store.user,
    collaborators: store.collaborators || new Map<string, UserProfile>(),
    collaboratorsById: store.collaboratorsById,
    keywords: store.keywords,
    manuscriptID: store.manuscriptID,
    modelMap: store.modelMap,
    saveModel: store.saveModel,
    deleteModel: store.deleteModel,
    commentTarget: store.commentTarget,
  }))
  const { state, view } = editor

  const [newComment, setNewComment] = useState<CommentAnnotation>()
  const createKeyword = useCallback(
    (name: string) => saveModel(buildKeyword(name)),
    [saveModel]
  )
  const currentUser = useMemo(() => user, [user])
  const [commentFilter, setCommentFilter] = useState<Pattern.CommentFilter>(
    Pattern.CommentFilter.ALL
  )

  const setCommentTarget = useCallback(
    (target) => dispatch({ commentTarget: target }),
    [dispatch]
  )

  const addComment = useCallback(
    (comment) => dispatch({ comments: [...comments, comment] }),
    [comments, dispatch]
  )

  const updateComments = useCallback(
    (comment) =>
      dispatch({
        comments: comments.map((c) => (c._id === comment._id && comment) || c),
      }),
    [comments, dispatch]
  )

  const removeComment = useCallback(
    (id) =>
      dispatch({
        comments: comments.filter((c) => c._id !== id),
      }),
    [comments, dispatch]
  )

  useEffect(() => {
    if (commentTarget && !newComment) {
      const newComment = buildComment(commentTarget) as CommentAnnotation
      const contribution = buildContribution(currentUser._id)
      newComment.contributions = [contribution]
      newComment.contributions = [contribution]

      const highlight = state && getHighlightTarget(newComment, state)

      if (highlight) {
        // newComment.originalText = getHighlightText(highlight, state)
        newComment.originalText = highlight.text
      }
      setNewComment(newComment)
    }
  }, [commentTarget, doc, newComment, state, currentUser])

  const commentsLabel = useMemo(() => {
    let labels: { [p: string]: string } = {}
    let graphicalAbstractFigureId: string | undefined = undefined

    doc.descendants((node) => {
      if (node.type.name === 'citation') {
        labels = {
          ...labels,
          [node.attrs['rid']]: node.attrs.contents.trim(),
        }
      }

      if (node.attrs['category'] === 'MPSectionCategory:abstract-graphical') {
        node.forEach((node) => {
          if (node.type.name === 'figure_element') {
            graphicalAbstractFigureId = node.attrs['id']
          }
        })
      }
    })

    const getLabels = (
      label: string,
      elements: string[],
      excludedElementId?: string
    ) =>
      elements
        .filter((element) => element !== excludedElementId)
        .reduce(
          (prev, element, index) => ({
            ...prev,
            [element]: `${label} ${++index}`,
          }),
          {}
        )

    const elementsOrders = getModelsByType<ElementsOrder>(
      modelMap,
      ObjectTypes.ElementsOrder
    )
    elementsOrders.map(({ elementType, elements }) => {
      if (
        elementType === ObjectTypes.TableElement ||
        elementType === ObjectTypes.FigureElement
      ) {
        const label =
          (elementType === ObjectTypes.FigureElement && 'Figure') || 'Table'
        labels = {
          ...labels,
          ...getLabels(label, elements, graphicalAbstractFigureId),
        }
      }
    })

    return labels
  }, [doc, modelMap])

  const items = useMemo<Array<[string, CommentData[]]>>(() => {
    const combinedComments = [...comments]

    if (newComment) {
      combinedComments.push(newComment)
    }
    const commentsTreeMap = buildCommentTree(doc, combinedComments)

    return Array.from(commentsTreeMap.entries())
  }, [comments, newComment, doc])

  const handleSetResolved = useCallback(
    async (comment) => {
      const savedComment = await saveModel({
        ...comment,
        resolved: !comment.resolved,
      } as CommentAnnotation)
      if (savedComment && savedComment._id === comment._id) {
        updateComments(savedComment)
      }
    },
    [saveModel, updateComments]
  )

  const { updateDocument } = useDocStore()

  const saveComment = useCallback(
    (comment: CommentAnnotation) => {
      return saveModel(comment).then((comment) => {
        if (newComment && newComment._id === comment._id) {
          setCommentTarget(undefined)
          setNewComment(undefined)
          addComment(comment)
          if (!comment.target.includes(ObjectTypes.Highlight)) {
            updateDocument(manuscriptID, doc.toJSON())
          }
          if (!comment.target.startsWith('MPHighlight:') && view?.state) {
            updateCommentAnnotationState(view?.state, view?.dispatch)
          }
        } else {
          updateComments(comment)
        }
        return comment
      })
    },
    [
      saveModel,
      newComment,
      view,
      setCommentTarget,
      addComment,
      updateDocument,
      manuscriptID,
      doc,
      updateComments,
    ]
  )

  const deleteComment = useCallback(
    (id: string, target?: string) => {
      const highlightId = target || commentTarget
      return deleteModel(id)
        .catch((error: Error) => {
          console.error(error)
        })
        .then(async () => {
          if (highlightId && highlightId.startsWith('MPHighlight:')) {
            await deleteModel(highlightId)
          }
          removeComment(id)
        })
        .catch((error: Error) => {
          console.error(error)
        })
        .finally(() => {
          if (highlightId && highlightId.startsWith('MPHighlight:')) {
            view &&
              deleteHighlightMarkers(highlightId)(view.state, view.dispatch)
          }

          if (newComment && newComment._id === id) {
            setCommentTarget(undefined)
            setNewComment(undefined)
          }
          if (target && !target?.startsWith('MPHighlight:') && view?.state) {
            updateCommentAnnotationState(view?.state, view?.dispatch)
          }
        })
    },
    [
      commentTarget,
      deleteModel,
      newComment,
      removeComment,
      setCommentTarget,
      view,
    ]
  )

  const scrollIntoHighlight = (comment: CommentAnnotation) => {
    const el =
      document.querySelector(`[data-reference-id="${comment.target}"]`) ||
      document.querySelector(`[id="${comment.target}"]`)
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
      if (!comment.target.includes(ObjectTypes.Highlight)) {
        return '#ffe08b'
      }

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

  const getHighlightComment = useCallback(
    (comment: CommentType) => {
      if (commentsLabel[comment.target]) {
        return { ...comment, originalText: commentsLabel[comment.target] }
      }
      return comment
    },
    [commentsLabel]
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
                      handleSetResolved={() => handleSetResolved(comment)}
                      isNew={isNew(comment as CommentAnnotation)}
                    >
                      <HighlightedText
                        comment={
                          getHighlightComment(comment) as CommentAnnotation
                        }
                        getHighlightTextColor={getHighlightTextColor}
                        onClick={scrollIntoHighlight}
                      />
                    </CommentWrapper>
                  </NoteBodyContainer>

                  {children.map((comment) => (
                    <ReplyBodyContainer key={comment._id}>
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
