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

import { clearCommentSelection } from '@manuscripts/body-editor'
import {
  Affiliation,
  CommentAnnotation,
  Contributor,
  Model,
  Supplement,
} from '@manuscripts/json-schema'
import { skipTracking } from '@manuscripts/track-changes-plugin'
import { schema } from '@manuscripts/transform'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

export const createContributorNode = (
  model: Partial<Contributor>,
  view: EditorView,
  doc: ProsemirrorNode,
  state: EditorState
) => {
  const { tr } = state
  doc.descendants((node, pos) => {
    if (node.type === schema.nodes.contributors) {
      tr.insert(
        pos + 1,
        schema.nodes.contributor.create(
          {
            ...model,
            id: model._id,
          },
          schema.text('_')
          /*
              quarterback as it is now works incorrectly with empty nodes and updating attributes on them is misinterpreted as deletion.
              We either need to update quarterback to work correctly with empty nodes attributes or provide some content for these nodes or
              implement a mechanism that would detect attributes updates on empty nodes and setMeta as we do for metaNodes
            */
        )
      )
      view.dispatch(tr)
      return false
    }
  })
}

export const createAffiliationNode = (
  model: Partial<Affiliation>,
  view: EditorView,
  doc: ProsemirrorNode,
  state: EditorState
) => {
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

export const saveComment = (
  comment: CommentAnnotation,
  view: EditorView,
  doc: ProsemirrorNode,
  state: EditorState,
  modelMap: Map<string, Model>
) => {
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
  const { tr } = state
  doc.descendants((node, pos) => {
    if (isNewComment) {
      /** for new comments will add comment node to the comment list node
       * */
      if (node.type === schema.nodes.comments) {
        skipTracking(
          tr.replaceWith(
            pos,
            pos + node.nodeSize,
            node.content.addToEnd(schema.nodes.comment.create(documentComment))
          )
        )
        return false
      }
    } else {
      if (node.attrs.id === comment._id && node.type === schema.nodes.comment) {
        skipTracking(
          tr.setNodeMarkup(pos, undefined, {
            ...documentComment,
          })
        )

        return false
      }
    }
  })
  clearCommentSelection(tr)
  view.dispatch(tr)

  return Promise.resolve(comment as Model)
}

export const deleteComment = (
  comment: CommentAnnotation,
  view: EditorView,
  doc: ProsemirrorNode,
  state: EditorState
) => {
  const { tr } = state
  doc.descendants((node, pos) => {
    if (node.attrs.id === comment._id && node.type === schema.nodes.comment) {
      tr.delete(pos, pos + node.nodeSize)
      tr.setMeta('track-changes-skip-tracking', true)
      clearCommentSelection(tr)
      view.dispatch(tr)
      return false
    }
  })
  return Promise.resolve(comment._id)
}

export const createSupplementNode = (
  view: EditorView,
  supplement: Supplement
) => {
  view.state.doc.descendants((node, pos) => {
    if (node.type === schema.nodes.supplements) {
      view.dispatch(
        view.state.tr.insert(
          pos + node.nodeSize - 1,
          schema.nodes.supplement.create({
            id: supplement._id,
            href: supplement.href,
            mimeType: supplement.MIME?.split('/')[0],
            mimeSubType: supplement.MIME?.split('/')[1],
            title: supplement.title,
          })
        )
      )
      return false
    }
  })
  return Promise.resolve(supplement)
}

export const deleteSupplementNode = (
  view: EditorView,
  supplement: Supplement
) => {
  const tr = view.state.tr
  tr.doc.descendants((node, pos) => {
    if (
      node.type === schema.nodes.supplement &&
      supplement._id === node.attrs.id
    ) {
      tr.delete(pos, pos + node.nodeSize)
    }
  })

  view.dispatch(tr)

  return Promise.resolve(supplement)
}
