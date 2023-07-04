/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2023 Atypon Systems LLC. All Rights Reserved.
 */

import {
  deleteHighlightMarkers,
  isHighlightComment,
  updateCommentAnnotationState,
} from '@manuscripts/body-editor'
import {
  CommentAnnotation,
  ElementsOrder,
  ObjectTypes,
} from '@manuscripts/json-schema'
import { buildCommentTree, CommentData } from '@manuscripts/style-guide'
import { getModelsByType } from '@manuscripts/transform'
import { EditorView } from 'prosemirror-view'
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react'

import { useStore } from '../store'

const cleanUpSelectedComment = () => {
  document
    .querySelectorAll(`.selected-comment`)
    .forEach((element) => element.classList.remove('selected-comment'))
}

/**
 * Return CRUD callbacks for the comment_list
 * @param view
 * @param setSelectedHighlightId
 */
export default (
  view: EditorView | undefined,
  setSelectedHighlightId: Dispatch<SetStateAction<string | undefined>>
) => {
  const [
    { newComments, doc, trackModelMap, saveTrackModel, deleteTrackModel },
    dispatch,
  ] = useStore((store) => ({
    doc: store.doc,
    trackModelMap: store.trackModelMap,
    saveTrackModel: store.saveTrackModel,
    deleteTrackModel: store.deleteTrackModel,
    newComments: store.newComments,
  }))

  const newCommentsList = Array.from(newComments.values())

  /**
   * Combined new comment(unsaved) with the saved comment.
   * and add replies for each comment, we do that in *buildCommentTree*
   */
  const items = useMemo<Array<[string, CommentData[]]>>(() => {
    const combinedComments = [
      ...getModelsByType<CommentAnnotation>(
        trackModelMap,
        ObjectTypes.CommentAnnotation
      ),
      ...newCommentsList,
    ]
    const commentsTreeMap = buildCommentTree(doc, combinedComments)
    return Array.from(commentsTreeMap.entries())
  }, [trackModelMap, newCommentsList, doc])

  const removePendingComment = useCallback(
    (comment: CommentAnnotation) => {
      if (newComments.has(comment._id)) {
        newComments.delete(comment._id)
        dispatch({
          newComments,
        })

        if (view?.state && !isHighlightComment(comment)) {
          view && updateCommentAnnotationState(view.state, view.dispatch)
        }
      }
      return comment
    },
    [dispatch, newComments, view]
  )

  const saveComment = useCallback(
    (comment: CommentAnnotation) =>
      saveTrackModel(comment).then(removePendingComment),
    [saveTrackModel, removePendingComment]
  )

  const setResolved = useCallback(
    async (comment) =>
      await saveTrackModel({
        ...comment,
        resolved: !comment.resolved,
      } as CommentAnnotation),
    [saveTrackModel]
  )

  const createReply = useCallback((targetId?: string) => {
    //  TODO:: create empty comment replay
  }, [])

  const deleteComment = useCallback(
    (id: string) => {
      const comment =
        newComments.get(id) || (trackModelMap.get(id) as CommentAnnotation)

      return deleteTrackModel(id)
        .then(() => removePendingComment(comment))
        .finally(() => {
          if (isHighlightComment(comment)) {
            view && deleteHighlightMarkers(id)(view.state, view.dispatch)
            setSelectedHighlightId(undefined)
          }

          cleanUpSelectedComment()
        })
    },
    [
      newComments,
      trackModelMap,
      deleteTrackModel,
      removePendingComment,
      view,
      setSelectedHighlightId,
    ]
  )

  return {
    comments: items,
    saveComment,
    setResolved,
    createReply,
    deleteComment,
  }
}

/**
 * Return labels of block comment as we don't store them in DB, will build them based on:
 * * element order for(figure, table) like **figure 1**
 * * content of the element like citation
 * * content one of it's children like section will use it's title(TODO)
 */
export const useCommentLabel = () => {
  const [{ doc, modelMap }] = useStore((store) => ({
    doc: store.doc,
    modelMap: store.modelMap,
  }))

  return useMemo(() => {
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
}
