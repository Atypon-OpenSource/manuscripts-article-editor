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
  CommentAnnotation,
  ElementsOrder,
  ObjectTypes,
} from '@manuscripts/json-schema'
import {
  buildCommentTree,
  CommentData,
  CommentType,
} from '@manuscripts/style-guide'
import { getModelsByType } from '@manuscripts/transform'
import { useCallback, useMemo } from 'react'

import { useStore } from '../store'

/**
 * Return CRUD callbacks for the comment_list
 */
export default () => {
  const [{ doc, modelMap, saveModel, deleteModel }] = useStore((store) => ({
    view: store.view,
    doc: store.doc,
    modelMap: store.trackModelMap,
    saveModel: store.saveTrackModel,
    deleteModel: store.deleteTrackModel,
  }))

  /**
   * Combined new comment(unsaved) with the saved comment.
   * and add replies for each comment, we do that in *buildCommentTree*
   */
  const items = useMemo<Array<[string, CommentData[]]>>(() => {
    const models = getModelsByType<CommentAnnotation>(
      modelMap,
      ObjectTypes.CommentAnnotation
    )
    const tree = buildCommentTree(doc, models)
    return Array.from(tree.entries())
  }, [modelMap, doc])

  const saveComment = useCallback(
    async (comment: CommentType) => {
      await saveModel(comment)
      return comment
    },
    [saveModel]
  )

  const setResolved = useCallback(
    async (comment) =>
      await saveModel({
        ...comment,
        resolved: !comment.resolved,
      } as CommentAnnotation),
    [saveModel]
  )

  const createReply = useCallback((targetId?: string) => {
    //  TODO:: create empty comment replay
  }, [])

  const deleteComment = useCallback(
    (id: string) => {
      deleteModel(id)
    },
    [deleteModel]
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
