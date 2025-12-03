/*!
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://mpapp-public.gitlab.io/manuscripts-frontend/LICENSE. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an “AS IS” basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is manuscripts-frontend.
 *
 * The Original Developer is the Initial Developer. The Initial Developer of the Original Code is Atypon Systems LLC.
 *
 * All portions of the code written by Atypon Systems LLC are Copyright (c) 2025 Atypon Systems LLC. All Rights Reserved.
 */
import { ManuscriptNode, schema } from '@manuscripts/transform'

import { compareSingleNodeAttrs } from './compare-documents'
import { compareParagraphLike } from './compare-paragraph-like'
import { compareTableElement } from './compare-table-element'
import {
  createComparisonDeleteAttrsDataTracked,
  createComparisonInsertAttrsDataTracked,
} from './create-dataTracked-attrs'
import { NodeComparison } from './distribute-nodes'

// Rebuilds the nodes tree from the distributed nodes, and applies the changes to the nodes
export const rebuildDocNodeTree = (
  nodeId: string,
  nodeMap: Map<string, NodeComparison>
): ManuscriptNode => {
  const entry = nodeMap.get(nodeId)
  if (!entry) {
    throw new Error(`Node with ID "${nodeId}" not found`)
  }

  const baseNode = entry.comparisonNode ?? entry.originalNode
  if (!baseNode) {
    throw new Error(`No node available for "${nodeId}"`)
  }
  const rebuiltChildren: ManuscriptNode[] = []
  if (
    entry.children &&
    !baseNode?.isTextblock &&
    entry.status !== 'deleted' &&
    entry.status !== 'inserted'
  ) {
    for (const childId of entry.children.keys()) {
      const childNode = rebuildDocNodeTree(childId, entry.children)
      rebuiltChildren.push(childNode)
    }
  }
  if (
    entry.status === 'deleted' &&
    !entry.comparisonNode?.isText &&
    !entry.originalNode?.isText
  ) {
    const finalAttrs = {
      ...baseNode.attrs,
      dataTracked: [createComparisonDeleteAttrsDataTracked('')],
    }
    return baseNode.type.create(finalAttrs, baseNode.content)
  } else if (
    entry.status === 'inserted' &&
    !entry.comparisonNode?.isText &&
    !entry.originalNode?.isText
  ) {
    const finalAttrs = {
      ...baseNode.attrs,
      dataTracked: [createComparisonInsertAttrsDataTracked('')],
    }
    return baseNode.type.create(finalAttrs, baseNode.content)
  } else if (
    entry.comparisonNode?.type == schema.nodes.table_element &&
    entry.originalNode?.type == schema.nodes.table_element
  ) {
    // TODO: find more generic way to handle this
    return compareTableElement(entry.originalNode, entry.comparisonNode)
  } else if (
    entry.comparisonNode?.isAtom &&
    entry.comparisonNode?.isBlock &&
    entry.originalNode?.isAtom &&
    entry.originalNode?.isBlock
  ) {
    return compareSingleNodeAttrs(
      entry.originalNode,
      entry.comparisonNode,
      baseNode.type,
      rebuiltChildren
    )
  } else if (
    entry.comparisonNode?.isTextblock &&
    entry.originalNode?.isTextblock
  ) {
    return compareParagraphLike(entry.originalNode, entry.comparisonNode)
  } else if (entry.comparisonNode?.isBlock && entry.originalNode?.isBlock) {
    return compareSingleNodeAttrs(
      entry.originalNode,
      entry.comparisonNode,
      baseNode.type,
      rebuiltChildren
    )
  }

  return baseNode.type.create(
    { ...baseNode.attrs },
    rebuiltChildren.length > 0 ? rebuiltChildren : baseNode.content
  )
}
