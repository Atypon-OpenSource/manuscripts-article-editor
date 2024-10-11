/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2024 Atypon Systems LLC. All Rights Reserved.
 */
import { ManuscriptEditorState, ManuscriptNode } from '@manuscripts/transform'
import { EditorState, Plugin } from 'prosemirror-state'

interface ExtendedPlugin extends Plugin {
  key: string
}

export const getNodeTextContent = (node: ManuscriptNode) => {
  let textContent = ''

  // Traverse the node and its descendants
  node.forEach((child) => {
    if (child.isText) {
      // If the child is a text node, add its text content
      textContent += child.text
    } else {
      // If the child is not a text node, recursively collect text content
      textContent += getNodeTextContent(child)
    }
  })

  return textContent
}

export const findPluginByKey = (
  state: ManuscriptEditorState,
  keyName: string
): ExtendedPlugin | null => {
  for (let i = 0; i < state.plugins.length; i++) {
    const plugin = state.plugins[i] as ExtendedPlugin

    if (plugin.key === keyName + '$') {
      return plugin
    }
  }

  return null
}

export const getParentNode = (state: EditorState, pos: number) => {
  const resolvedPos = state.doc.resolve(pos)

  for (let depth = resolvedPos.depth; depth > 0; depth--) {
    const parent = resolvedPos.node(depth)
    if (parent.isTextblock === false) {
      return parent
    }
  }

  return null
}

export const decodeHTMLEntities = (text: string) => {
  const el = document.createElement('div')
  el.innerHTML = text
  return el.innerText
}
