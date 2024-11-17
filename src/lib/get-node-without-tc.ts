/*!
 * © 2024 Atypon Systems LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TrackedAttrs } from '@manuscripts/track-changes-plugin'
import { JSONNode, ManuscriptNode } from '@manuscripts/transform'

export function checkSuggestionsFor(
  node: JSONNode,
  onNodeReal: (node: JSONNode) => void
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
