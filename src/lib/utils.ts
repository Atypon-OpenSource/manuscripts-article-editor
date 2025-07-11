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
import { EditorState } from 'prosemirror-state'

export const getParentNode = (state: EditorState, pos: number) => {
  const resolvedPos = state.doc.resolve(pos)

  for (let depth = resolvedPos.depth; depth > 0; depth--) {
    const parent = resolvedPos.node(depth)
    if (parent.isText === false) {
      if (parent.type == state.schema.nodes.paragraph) {
        const grandParent = resolvedPos.node(depth - 1)
        if (grandParent.type == state.schema.nodes.footnote) {
          return grandParent
        } else {
          return parent
        }
      }
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

export const scrollIntoView = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  if (rect.bottom > window.innerHeight || rect.top < 150) {
    element.scrollIntoView()
  }
}
