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

import { TrackedAttrs } from '@manuscripts/track-changes-plugin'
import { JSONProsemirrorNode, ManuscriptNode } from '@manuscripts/transform'

export function checkSuggestionsFor(
  node: JSONProsemirrorNode,
  onNodeReal: (node: JSONProsemirrorNode) => void
) {
  let textString = ''
  if (node.content?.length) {
    const newContent = []

    nodesLoop: for (let i = 0; i < node.content?.length; i++) {
      const child = node.content[i]
      const newMarks = []
      if (child.type === 'text' && child.marks) {
        for (let i = 0; i < child.marks?.length; i++) {
          if (child.marks[i].type === 'tracked_insert') {
            // skipping the entire node as it's unconfirmed
            continue nodesLoop
          }

          if (child.marks[i].type === 'tracked_delete') {
            // drop marks and treat deleted content as normal
            continue
          }
          newMarks.push(child.marks[i])
        }
        textString += child.text
      }
      if (child.attrs && child.attrs.dataTracked) {
        const changes = node.attrs.dataTracked as TrackedAttrs[]
        if (changes.some(({ operation }) => operation === 'insert')) {
          continue
        }
      }
      checkSuggestionsFor(child, onNodeReal)
      onNodeReal(child)
      newContent.push(child)
    }
    node.content = newContent
  }

  return textString
}

export function getNodeRealText(node: ManuscriptNode) {
  let text = ''
  checkSuggestionsFor(node.toJSON(), (jsonNode) => {
    if (jsonNode.text) {
      text += jsonNode.text
    }
  })
  return text
}
