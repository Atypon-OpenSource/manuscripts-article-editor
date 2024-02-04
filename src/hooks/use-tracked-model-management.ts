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
  Affiliation,
  CommentAnnotation,
  Contributor,
  // Contributor,
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

import { trackedJoint } from '../components/track-changes/utils'
import { setNodeAttrs } from '../lib/node-attrs'
import { useStore } from '../store'

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
    const modelsFromPM = encode(doc)
    // adding supplements from final model map as they are meta (not PM presentable)
    finalModelMap.forEach((model) => {
      if (model.objectType === ObjectTypes.Supplement) {
        modelsFromPM.set(model._id, model)
      }
    })
    return modelsFromPM
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, finalModelMap])

  const [, dispatchStore] = useStore()

  const matchByTrackVersion = (
    node: ProsemirrorNode,
    realId: string,
    trackedId: string
  ) => {
    if (node.attrs.dataTracked && realId === node.attrs.id) {
      const matchedTrackedId = (node.attrs.dataTracked as TrackedAttrs[]).find(
        (tracked) => tracked.id === trackedId
      )
      return !!matchedTrackedId
      // check and identify precise dataTracked version
    }
  }

  const createContributorNode = (model: Partial<Contributor>) => {
    if (!view) {
      throw Error('View not available')
    }

    const { tr } = state
    doc.descendants((node, pos) => {
      if (node.type === schema.nodes.contributors) {
        tr.insert(
          pos + node.nodeSize - 1,
          schema.nodes.contributor.create(
            {
              ...model,
              id: model._id,
            },
            schema.text('_')
            /*
              quarterback as it is now works incorrectly with empty nodes and updating attributes on them are misinterpreted as deletion
              we either need to update quarterback to work correctly with empty nodes attributes or provide some content for these nodes or
              implement a mechanism that would detect attributes updates on empty nodes and setMeta as we do for metaNodes
            */
          )
        )
        view.dispatch(tr)
        return false
      }
    })
  }

  const createAffiliationNode = (model: Partial<Affiliation>) => {
    if (!view) {
      throw Error('View not available')
    }
    const { tr } = state
    doc.descendants((node, pos) => {
      if (node.type === schema.nodes.affiliations) {
        tr.insert(
          pos + node.nodeSize - 1,
          schema.nodes.affiliation.create(
            {
              ...model,
              id: model._id,
            },
            schema.text('_')
          )
        )
        view.dispatch(tr)
        return false
      }
    })
  }

  const saveCommentNode = useCallback(
    (comment: CommentAnnotation) => {
      if (!view) {
        throw Error('View not available')
      }

      const documentComment = {
        id: comment._id,
        contents: comment.contents,
        target: comment.target,
        selector: comment.selector,
        contributions: comment.contributions,
        resolved: comment.resolved,
        originalText: comment.originalText,
      }
      const isNewComment = !modelMap.has(comment._id)
      const isHighlightComment =
        comment.selector && comment.selector.from !== comment.selector.to

      const { tr } = state
      doc.descendants((node, pos) => {
        if (isNewComment || isHighlightComment) {
          /** for new comments will update target comments array with the comment id
           *  and add comment node to the comment list node
           * */
          if (node.attrs.id === comment.target && !isHighlightComment) {
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              comments: [...(node.attrs.comments || []), comment._id],
            })
          }
          if (node.type === schema.nodes.comments) {
            tr.replaceWith(
              pos,
              pos + node.nodeSize,
              node.content.addToEnd(
                schema.nodes.comment.create(documentComment)
              )
            )
            tr.setMeta('track-changes-skip-tracking', true)
            view.dispatch(tr)
            return false
          }
        } else {
          if (node.attrs.id === comment._id) {
            tr.setNodeMarkup(pos, undefined, {
              ...documentComment,
            })
            tr.setMeta('track-changes-skip-tracking', true)

            view.dispatch(tr)
            return false
          }
        }
      })

      return Promise.resolve(comment as Model)
    },
    [doc, modelMap, state, view]
  )

  const deleteCommentNode = useCallback(
    (comment: CommentAnnotation) => {
      if (!view) {
        throw Error('View not available')
      }

      const { tr } = state
      const isHighlightComment =
        comment.selector && comment.selector.from !== comment.selector.to

      doc.descendants((node, pos) => {
        if (
          node.attrs.id === comment.target &&
          node.attrs.comments &&
          !isHighlightComment
        ) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            comments: [
              ...node.attrs.comments.filter((id: string) => id != comment._id),
            ],
          })
        }

        if (
          node.attrs.id === comment._id &&
          node.type === schema.nodes.comment
        ) {
          tr.delete(pos, pos + node.nodeSize)
          tr.setMeta('track-changes-skip-tracking', true)
          view.dispatch(tr)
          return false
        }
      })
      return Promise.resolve(comment._id)
    },
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

        let dataTrackedId = ''
        if (model._id?.includes(trackedJoint)) {
          // when encoding we modify ids of track changes artefacts to avoid duplicate ids in the modelMap
          // when saving back we need to convert those ids back and also apply the updates on the right nodes
          const base = model._id.split(trackedJoint)
          dataTrackedId = base[1]
          model._id = base[0]
        }

        if (view) {
          doc.descendants((node, pos) => {
            if (
              node.attrs.id === model._id ||
              matchByTrackVersion(node, model._id || '', dataTrackedId)
            ) {
              const decoder = new Decoder(modelMap, true) // as node ids are unique it will always occur just once (or never) so it's safe to keep in the loop
              const newDoc = decoder.createArticleNode()
              newDoc.descendants((newNode, pos) => {
                if (
                  newNode.attrs.id === node.attrs.id ||
                  matchByTrackVersion(
                    node,
                    newNode.attrs.id?.split(trackedJoint)[0] || '',
                    dataTrackedId
                  )
                ) {
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
            createContributorNode(model as unknown as Contributor)
            // return saveContributorNode(model as unknown as Contributor)
          } else if (model.objectType === ObjectTypes.Affiliation) {
            createAffiliationNode(model as unknown as Affiliation)
          } else {
            // ...that is if there is no node in the prosemirror doc for that id,
            // that update final model.
            // This is needed until we implement tracking on metadata
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

      const base = id.split(trackedJoint)

      if (modelMap.has(id)) {
        doc.descendants((node, pos) => {
          if (
            node.attrs.id === id ||
            matchByTrackVersion(node, base[0], base[1] || '')
          ) {
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