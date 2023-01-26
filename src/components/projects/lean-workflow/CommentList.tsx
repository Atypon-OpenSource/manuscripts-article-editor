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
  commentScroll,
  deleteHighlightMarkers,
  getHighlightTarget,
  updateCommentAnnotationState,
} from '@manuscripts/body-editor'
import {
  CommentAnnotation,
  ElementsOrder,
  ObjectTypes,
  UserProfile,
} from '@manuscripts/json-schema'
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
import {
  buildComment,
  buildContribution,
  buildKeyword,
  getModelsByType,
} from '@manuscripts/transform'
import { TextSelection } from 'prosemirror-state'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useCreateEditor } from '../../../hooks/use-create-editor'
import { useStore } from '../../../store'
import * as Pattern from '../CommentListPatterns'
import { HighlightedText } from '../HighlightedText'

interface Props {
  editor: ReturnType<typeof useCreateEditor>
}

const isHighlightComment = (comment: CommentAnnotation) =>
  comment.selector && comment.selector.from !== comment.selector.to

const cleanUpSelectedComment = () => {
  document
    .querySelectorAll(`.selected-comment`)
    .forEach((element) => element.classList.remove('selected-comment'))
}

export const CommentList: React.FC<Props> = ({ editor }) => {
  const [
    {
      comments = [],
      comment,
      doc,
      user,
      collaborators,
      collaboratorsById,
      keywords,
      modelMap,
      saveTrackModel,
      deleteTrackModel,
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
    saveTrackModel: store.saveTrackModel,
    deleteTrackModel: store.deleteTrackModel,
    comment: store.comment,
  }))
  const { state, view } = editor

  const [newComment, setNewComment] = useState<CommentAnnotation>()
  const createKeyword = useCallback(
    (name: string) => saveTrackModel(buildKeyword(name)),
    [saveTrackModel]
  )
  const currentUser = useMemo(() => user, [user])
  const [commentFilter, setCommentFilter] = useState<Pattern.CommentFilter>(
    Pattern.CommentFilter.ALL
  )

  const setComment = useCallback(
    (targetId?: string) =>
      dispatch({ comment: targetId && buildComment(targetId) }),
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
    if (comment && comment.target && !newComment) {
      const contribution = buildContribution(currentUser._id)
      comment.contributions = [contribution]

      if (isHighlightComment(comment)) {
        const highlight = state && getHighlightTarget(comment, state)

        if (highlight) {
          // newComment.originalText = getHighlightText(highlight, state)
          comment.originalText = highlight.text
          setNewComment(comment)
        }
      } else {
        setNewComment(comment)
      }
    }
  }, [comment, doc, newComment, state, currentUser])

  /**
   * This map holds all block elements in the editor(citation, figure, table)
   * will be used to show the header of the block comment which is the element label
   */
  const commentsLabels = useMemo(() => {
    const labelsMap = new Map<string, string>()
    let graphicalAbstractFigureId: string | undefined = undefined

    doc.descendants((node) => {
      if (node.type.name === 'citation') {
        labelsMap.set(node.attrs['rid'], node.attrs.contents.trim())
      }

      if (node.attrs['category'] === 'MPSectionCategory:abstract-graphical') {
        node.forEach((node) => {
          if (node.type.name === 'figure_element') {
            graphicalAbstractFigureId = node.attrs['id']
          }
        })
      }
    })

    const setLabels = (
      label: string,
      elements: string[],
      excludedElementId?: string
    ) =>
      elements
        .filter((element) => element !== excludedElementId)
        .map((element, index) => labelsMap.set(element, `${label} ${++index}`))

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
        setLabels(label, elements, graphicalAbstractFigureId)
      }
    })

    return labelsMap
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
      const savedComment = await saveTrackModel({
        ...comment,
        resolved: !comment.resolved,
      } as CommentAnnotation)
      if (savedComment && savedComment._id === comment._id) {
        updateComments(savedComment)
      }
    },
    [saveTrackModel, updateComments]
  )

  const saveComment = useCallback(
    (comment: CommentAnnotation) => {
      return saveTrackModel(comment).then((comment) => {
        if (newComment && newComment._id === comment._id) {
          setComment(undefined)
          setNewComment(undefined)
          addComment(comment)

          if (view?.state && !isHighlightComment(comment)) {
            updateCommentAnnotationState(view?.state, view?.dispatch)
          }
        } else {
          updateComments(comment)
        }
        return comment
      })
    },
    [
      saveTrackModel,
      newComment,
      setComment,
      addComment,
      view?.state,
      view?.dispatch,
      updateComments,
    ]
  )

  const deleteComment = useCallback(
    (id: string) => {
      const comment = newComment || (modelMap.get(id) as CommentAnnotation)
      return deleteTrackModel(id)
        .then(() => {
          removeComment(id)
        })
        .finally(() => {
          if (comment.selector?.from !== comment.selector?.to) {
            view && deleteHighlightMarkers(id)(view.state, view.dispatch)
          }

          if (newComment && newComment._id === id) {
            setComment(undefined)
            setNewComment(undefined)
          }
          if (view?.state && !isHighlightComment(comment)) {
            updateCommentAnnotationState(view?.state, view?.dispatch)
          }
          cleanUpSelectedComment()
          setSelectedHighlightId(undefined)
        })
    },
    [deleteTrackModel, modelMap, newComment, removeComment, setComment, view]
  )

  const [selectedHighlightId, setSelectedHighlightId] = useState<string>()

  /**
   * check if the selection pointing to a highlight node
   */
  useEffect(() => {
    const childCount = state.selection.$from.parent.content.childCount
    const nodeIndex = state.selection.$from.index()

    if (state.selection instanceof TextSelection && childCount > nodeIndex) {
      const nodeBeforePos = state.selection.$from.posAtIndex(nodeIndex - 1)
      const nodeAfterPos = state.selection.$from.posAtIndex(nodeIndex + 1)
      const nodeBeforeNode = state.doc.nodeAt(nodeBeforePos)
      const nodeAfterNode = state.doc.nodeAt(nodeAfterPos)
      if (
        nodeBeforeNode &&
        nodeAfterNode &&
        nodeBeforeNode.type === state.schema.nodes.highlight_marker &&
        nodeAfterNode.type === state.schema.nodes.highlight_marker
      ) {
        setSelectedHighlightId(nodeAfterNode.attrs.id)
        return
      }
    }
    setSelectedHighlightId(undefined)
  }, [state])

  useEffect(() => {
    if (selectedHighlightId) {
      commentScroll(selectedHighlightId, 'inspector', true)
    }
  }, [selectedHighlightId])

  const scrollIntoHighlight = (comment: CommentAnnotation) => {
    const commentId = comment.selector ? comment._id : comment.target
    commentScroll(commentId, 'editor', isHighlightComment(comment))
    setSelectedHighlightId(undefined)
  }

  const isNew = useCallback(
    (comment: CommentAnnotation): boolean => {
      return newComment ? newComment._id === comment._id : false
    },
    [newComment]
  )

  const getHighlightTextColor = useCallback(
    (comment: CommentAnnotation) => {
      if (!isHighlightComment(comment)) {
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
      if (commentsLabels.has(comment.target)) {
        return { ...comment, originalText: commentsLabels.get(comment.target) }
      }
      return comment
    },
    [commentsLabels]
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
      <Container className={'comments-group'}>
        {items.map(([target, commentData]) => {
          // TODO: move this into a child component?
          const selectedNoteData =
            commentFilter === Pattern.CommentFilter.ALL
              ? commentData
              : commentData.filter((note) => !note.comment.resolved)
          return (
            <CommentTarget key={target} isSelected={false}>
              {selectedNoteData.map(({ comment, children }) => (
                <Pattern.Thread key={comment._id}>
                  <NoteBodyContainer
                    id={comment.selector ? comment._id : comment.target}
                    isSelected={false}
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
                      handleCreateReply={setComment}
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
      </Container>
    </React.Fragment>
  )
}

const Container = styled(Pattern.Container)`
  .selected-comment {
    border: 1px solid ${(props) => props.theme.colors.border.primary};
    border-left: 4px solid ${(props) => props.theme.colors.border.primary};
    background: ${(props) => props.theme.colors.background.selected};
  }
`
