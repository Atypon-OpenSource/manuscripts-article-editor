/*!
 * © 2025 Atypon Systems LLC
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
import { ManuscriptNode } from '@manuscripts/transform'

import { compareFigCaption } from './compare-table-element'
import { compareTextLikeContent, compareSingleNodeAttrs } from './compare-documents'
import { NodeComparison } from './distribute-nodes'
export const compareFigureElement = (
  figureELementMapChildren: Map<string, NodeComparison>
) => {
  const figureElementChildren: ManuscriptNode[] = []
  figureELementMapChildren.forEach((data) => {
    const originalNode = data.originalNode!
    const comparisonNode = data.comparisonNode!
    if (
      (originalNode?.isLeaf && originalNode?.isAtom) ||
      (comparisonNode?.isLeaf && comparisonNode?.isAtom)
    ) {
      figureElementChildren.push(
        compareSingleNodeAttrs(
          originalNode,
          comparisonNode,
          comparisonNode.type
        )
      )
    } else if (
      originalNode?.type.name === 'figcaption' ||
      comparisonNode?.type.name === 'figcaption'
    ) {
      figureElementChildren.push(
        compareFigCaption(originalNode, comparisonNode)
      )
    } else if (originalNode?.isTextblock && comparisonNode?.isTextblock) {
      figureElementChildren.push(
        compareTextLikeContent(
          originalNode,
          comparisonNode,
          comparisonNode.type
        )
      )
    } else {
      figureElementChildren.push(comparisonNode)
    }
  })
  return figureElementChildren
}
