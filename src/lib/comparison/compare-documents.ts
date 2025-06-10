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
import { isEqual } from 'lodash'
import { NodeType } from 'prosemirror-model'

import { ManuscriptSnapshot } from '../doc'
import { createComparisonSetAttrsDataTracked } from './create-dataTracked-attrs'
import { distributeNodesForComparison } from './distribute-nodes'
import { rebuildDocNodeTree } from './rebuild-nodes-tree'

// The entry point for the comparison mode, which is used to compare two ManuscriptNode trees
// It distributes the nodes, rebuilds the nodes tree and then creates a new ManuscriptNode tree
export const compareDocuments = (
  originalSnapshot: ManuscriptSnapshot,
  comparisonSnapshot: ManuscriptSnapshot
) => {
  const originalDocument = schema.nodeFromJSON(originalSnapshot.snapshot)
  const comparisonDocument = schema.nodeFromJSON(comparisonSnapshot.snapshot)

  const distributedNodes = distributeNodesForComparison(
    originalDocument,
    comparisonDocument
  )
  const distributedNodesArray: ManuscriptNode[] = []
  distributedNodes.forEach((_, key) => {
    distributedNodesArray.push(rebuildDocNodeTree(key, distributedNodes))
  })

  const manuscript = schema.nodes.manuscript.create(
    comparisonDocument.attrs,
    distributedNodesArray
  )

  return manuscript
}

// Compares the attributes of two nodes and returns a new node with the updated attributes
export const compareSingleNodeAttrs = (
  originalNode: ManuscriptNode,
  comparisonNode: ManuscriptNode,
  nodeType: NodeType,
  rebuiltChildren: ManuscriptNode[]
): ManuscriptNode => {
  const originalAttrs = originalNode?.attrs || {}
  const comparisonAttrs = comparisonNode?.attrs || {}
  if (!isEqual(originalAttrs, comparisonAttrs)) {
    return nodeType.create(
      {
        ...comparisonAttrs,
        dataTracked: [createComparisonSetAttrsDataTracked('', originalAttrs)],
      },
      rebuiltChildren.length > 0
        ? rebuiltChildren
        : comparisonNode?.content || null
    )
  } else {
    return nodeType.create(
      comparisonAttrs,
      rebuiltChildren.length > 0
        ? rebuiltChildren
        : comparisonNode?.content || null
    )
  }
}
