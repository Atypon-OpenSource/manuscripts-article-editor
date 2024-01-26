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

import { isDeleted } from '@manuscripts/body-editor'
import {
  Affiliation,
  CommentAnnotation,
  Contributor,
  Model,
  ObjectTypes,
} from '@manuscripts/json-schema'
import { TrackedAttrs } from '@manuscripts/track-changes-plugin'
import {
  Build,
  Decoder,
  encode,
  ManuscriptEditorView,
  ManuscriptNode,
  schema,
} from '@manuscripts/transform'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Transaction } from 'prosemirror-state'
import { useCallback, useMemo } from 'react'

import { setNodeAttrs } from '../lib/node-attrs'
import { useStore } from '../store'
import { adaptTrackedData } from './adapt-tracked-data'
import {
  createAffiliationNode,
  createContributorNode,
  deleteComment,
  saveComment,
} from './creators'

const useTrackedModelManagement = (
  doc: ManuscriptNode,
  view: ManuscriptEditorView | undefined,
  state: EditorState,
  dispatch: (tr: Transaction) => EditorState,
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>,
  deleteModel: (id: string) => Promise<string>,
  finalModelMap: Map<string, Model>
) => {
  const modelMap = useMemo(() => {
    const adaptedDoc = adaptTrackedData(doc.toJSON())
    const modelsFromPM = encode(schema.nodeFromJSON(adaptedDoc))

    // adding supplements from final model map as they are meta (not PM presentable)
    finalModelMap.forEach((model) => {
      if (model.objectType === ObjectTypes.Supplement) {
        modelsFromPM.set(model._id, model)
      }
    })

    // @TODO - integrate into adaptTrackedData to avoid repeated interation
    doc.descendants((node) => {
      if (node.attrs.id && node.attrs.dataTracked) {
        // deleting nodes from model map that considered deleted due to current track changes status so they won't be visible in inspector and other UI
        if (isDeleted(node)) {
          modelsFromPM.delete(node.attrs.id)
          return true
        }
      }
    })

    return modelsFromPM
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, finalModelMap])

  const [, dispatchStore] = useStore()

  const saveCommentNode = useCallback(
    (comment: CommentAnnotation) =>
      saveComment(comment, view, doc, state, modelMap),
    [doc, modelMap, state, view]
  )

  const deleteCommentNode = useCallback(
    (comment: CommentAnnotation) => deleteComment(comment, view, doc, state),
    [doc, state, view]
  )

  const saveTrackModel = useCallback(
    <T extends Model>(model: T | Build<T> | Partial<T>) => {
      if (model.objectType === ObjectTypes.CommentAnnotation) {
        return saveCommentNode(model as unknown as CommentAnnotation)
      }

      if (model._id) {
        const currentModel = modelMap.get(model._id!)
        if (currentModel) {
          modelMap.set(model._id, { ...currentModel, ...model })
        } else {
          modelMap.set(model._id, model as Model)
        }

        let foundInDoc = false

        if (view) {
          doc.descendants((node, pos) => {
            if (node.attrs.id === model._id) {
              const decoder = new Decoder(modelMap, true) // as node ids are unique it will always occur just once (or never) so it's safe to keep in the loop
              const newDoc = decoder.createArticleNode()
              newDoc.descendants((newNode, pos) => {
                if (newNode.attrs.id === node.attrs.id) {
                  setNodeAttrs(view.state, view.dispatch, node.attrs.id, {
                    ...newNode.attrs,
                    id: node.attrs.id,
                  })
                }
              })
              foundInDoc = true
            }
          })
        }

        if (!foundInDoc) {
          if (model.objectType === ObjectTypes.Contributor) {
            createContributorNode(
              model as unknown as Contributor,
              view,
              doc,
              state
            )
          } else if (model.objectType === ObjectTypes.Affiliation) {
            createAffiliationNode(
              model as unknown as Affiliation,
              view,
              doc,
              state
            )
          } else {
            // ...that is if there is no node in the prosemirror doc for that id,
            // that update final model.
            // This is needed until we move all the data into prosemirror
            saveModel(model)
          }
        }
      }
      return Promise.resolve(model)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modelMap, saveModel, doc, view]
  )

  const deleteTrackModel = useCallback(
    (id: string) => {
      if (modelMap.get(id)?.objectType === ObjectTypes.CommentAnnotation) {
        return deleteCommentNode(modelMap.get(id) as CommentAnnotation)
      }

      if (modelMap.has(id)) {
        doc.descendants((node, pos) => {
          if (node.attrs.id === id) {
            const { tr } = state
            tr.delete(pos, pos + node.nodeSize)
            dispatch(tr)
          }
        })
      } else {
        deleteModel(id)
      }

      return Promise.resolve(id)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      modelMap,
      deleteCommentNode,
      doc,
      state,
      dispatch,
      dispatchStore,
      deleteModel,
    ]
  )

  const getTrackModel = useCallback(
    (id: string) => modelMap.get(id),
    [modelMap]
  )

  return {
    saveTrackModel,
    deleteTrackModel,
    trackModelMap: modelMap,
    getTrackModel,
  }
}

export default useTrackedModelManagement
