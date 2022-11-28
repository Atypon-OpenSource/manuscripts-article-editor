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
  Build,
  Decoder,
  encode,
  ManuscriptEditorView,
  ManuscriptNode,
  ManuscriptSchema,
  schema,
} from '@manuscripts/manuscript-transform'
import { Model, ObjectTypes } from '@manuscripts/manuscripts-json-schema'
import { EditorState, Transaction } from 'prosemirror-state'
import { useCallback, useMemo } from 'react'

import { filterNodesWithTrackingData } from '../components/track-changes/utils'
import { setNodeAttrs } from '../lib/node-attrs'
import { useStore } from '../store'

const useTrackedModelManagement = (
  doc: ManuscriptNode,
  view: ManuscriptEditorView | undefined,
  state: EditorState<ManuscriptSchema>,
  dispatch: (tr: Transaction<any>) => EditorState<ManuscriptSchema>,
  saveModel: <T extends Model>(model: T | Build<T> | Partial<T>) => Promise<T>,
  deleteModel: (id: string) => Promise<string>,
  finalModelMap: Map<string, Model>
) => {
  const modelMap = useMemo(() => {
    const docClean = filterNodesWithTrackingData(doc.toJSON())
    const modelsFromPM = encode(schema.nodeFromJSON(docClean))
    finalModelMap.forEach((model) => {
      if (model.objectType === ObjectTypes.Supplement) {
        modelsFromPM.set(model._id, model)
      }
    })
    return finalModelMap
  }, [doc])

  const [, dispatchStore] = useStore()

  const saveTrackModel = useCallback(
    <T extends Model>(model: T | Build<T> | Partial<T>) => {
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
                  setNodeAttrs(
                    view.state,
                    view.dispatch,
                    node.attrs.id,
                    newNode.attrs
                  )
                }
              })
              foundInDoc = true
            }
          })
        }

        if (!foundInDoc) {
          // ...that is if there is no node in the prosemirror doc for that id, that update final model. This is needed until we implement tracking on metadata
          saveModel(model)
        }
      }
      return Promise.resolve(model)
    },
    [modelMap, saveModel, doc, view]
  )

  const deleteTrackModel = useCallback(
    (id: string) => {
      if (modelMap.has(id)) {
        modelMap.delete(id)
        doc.descendants((node, pos) => {
          if (node.attrs.id === id) {
            const { tr } = state
            tr.delete(pos, pos + node.nodeSize)
            dispatch(tr)
            dispatchStore({ trackModelMap: modelMap })
          }
        })
      } else {
        deleteModel(id)
      }

      return Promise.resolve(id)
    },
    [dispatch, dispatchStore, deleteModel, doc, modelMap, state] // will loop rerenders probably because of modelMap
  )

  return { saveTrackModel, deleteTrackModel, trackModelMap: modelMap }
}

export default useTrackedModelManagement
