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

import { ManuscriptEditorState, ManuscriptNode } from '@manuscripts/transform'

import { findPluginByKey, getNodeTextContent } from './utils'

export const findFootnoteById = (
  doc: ManuscriptNode,
  id: string
): ManuscriptNode | null => {
  let footnoteNode: ManuscriptNode | null = null

  doc.descendants((node) => {
    if (node.type.name === 'footnote' && node.attrs.id === id) {
      footnoteNode = node
      return false // stop traversal
    }
    if (footnoteNode) {
      return false
    }
    return true // continue traversal
  })
  return footnoteNode
}

export const getInlineFootnoteContent = (
  doc: ManuscriptNode,
  attrs: Record<any, any>
): string => {
  let footnote = null
  if (attrs.rids && attrs.rids.length > 0) {
    footnote = findFootnoteById(doc, attrs.rids[0])
  }
  return `<sup class="footnote-decoration">${
    attrs.contents ? attrs.contents : ''
  }</sup>${footnote ? footnote.textContent : ''}`
}

export const getFootnoteText = (
  state: ManuscriptEditorState,
  node: ManuscriptNode
) => {
  const footnotesPlugin = findPluginByKey(state, 'footnotes')
  const pluginState = footnotesPlugin?.getState(state)
  let decorationText = ''
  if (pluginState) {
    decorationText = pluginState.labels.get(node.attrs.id)
  }
  return `<sup class="footnote-decoration">${
    decorationText ? decorationText : ''
  }</sup>${getNodeTextContent(node)}`
}
