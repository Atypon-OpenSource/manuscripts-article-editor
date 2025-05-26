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

export type NodeComparison = {
  originalNode?: ManuscriptNode
  comparisonNode?: ManuscriptNode
  children?: Map<string, NodeComparison>
  status?: 'deleted' | 'inserted' | 'unchanged'
}

const createNodeKey = (node: ManuscriptNode, index = 0): string => {
  const id = node.attrs.id || node.attrs.objectId
  if (id) {
    return `${node.type.name}:${id}`
  }
  return `${node.type.name}:${index}`
}

export const distributeNodesForComparison = (
  originalNodes: ManuscriptNode[],
  comparisonNodes: ManuscriptNode[]
): Map<string, NodeComparison> => {
  const distributedMap = new Map<string, NodeComparison>()

  // Helper function to process child nodes recursively
  const processChildNodes = (
    node: ManuscriptNode,
    isOriginal: boolean,
    parentMap: Map<string, NodeComparison>,
    orderMap: Map<string, number>
  ) => {
    if (node.content && node.content.childCount > 0) {
      // Create an ordered array to track position
      const childKeys: string[] = []

      let count = 0
      node.content.forEach((childNode, index) => {
        if (childNode.isBlock) {
          const key = createNodeKey(childNode, count++)
          childKeys.push(key)

          // Store the position in the order map
          if (!isOriginal) {
            orderMap.set(key, index)
          }

          if (!parentMap.has(key)) {
            parentMap.set(key, {
              originalNode: isOriginal ? childNode : undefined,
              comparisonNode: isOriginal ? undefined : childNode,
              children: new Map<string, NodeComparison>(),
              status: isOriginal ? 'deleted' : 'inserted',
            })
          } else {
            const existingEntry = parentMap.get(key)!
            if (isOriginal) {
              existingEntry.originalNode = childNode
            } else {
              existingEntry.comparisonNode = childNode
            }

            if (existingEntry.originalNode && existingEntry.comparisonNode) {
              existingEntry.status = 'unchanged'
            }

            if (!existingEntry.children) {
              existingEntry.children = new Map<string, NodeComparison>()
            }
          }

          // Recursively process children of this node
          const childOrderMap = new Map<string, number>()
          processChildNodes(
            childNode,
            isOriginal,
            parentMap.get(key)!.children!,
            childOrderMap
          )
        }
      })

      // When processing the comparison document, reorder the map based on the order of nodes
      if (!isOriginal) {
        const orderedMap = new Map<string, NodeComparison>()

        const sortedKeys = [...parentMap.keys()].sort((a, b) => {
          const posA = orderMap.get(a) ?? 999
          const posB = orderMap.get(b) ?? 999
          return posA - posB
        })

        // Rebuild the map in correct order
        for (const key of sortedKeys) {
          orderedMap.set(key, parentMap.get(key)!)
        }

        // Clear the original map and replace with ordered entries
        parentMap.clear()
        for (const [key, value] of orderedMap.entries()) {
          parentMap.set(key, value)
        }
      }
    }
  }

  // First pass: original nodes
  const topLevelOrderMap = new Map<string, number>()
  originalNodes.forEach((node, index) => {
    const key = createNodeKey(node)
    distributedMap.set(key, {
      originalNode: node,
      children: new Map<string, NodeComparison>(),
      status: 'deleted', // Initially marked as deleted until we find a match
    })

    // Store original order
    topLevelOrderMap.set(key, index)

    if (
      node.type.name === 'body' ||
      node.type.name === 'backmatter' ||
      node.type.name === 'abstracts'
    ) {
      const childOrderMap = new Map<string, number>()
      processChildNodes(
        node,
        true,
        distributedMap.get(key)!.children!,
        childOrderMap
      )
    }
  })

  // Second pass: comparison nodes
  const comparisonOrderMap = new Map<string, number>()
  comparisonNodes.forEach((node, index) => {
    const key = createNodeKey(node)
    comparisonOrderMap.set(key, index)

    if (distributedMap.has(key)) {
      const existingEntry = distributedMap.get(key)!
      existingEntry.comparisonNode = node

      existingEntry.status = 'unchanged'

      if (!existingEntry.children) {
        existingEntry.children = new Map<string, NodeComparison>()
      }
    } else {
      distributedMap.set(key, {
        comparisonNode: node,
        children: new Map<string, NodeComparison>(),
        status: 'inserted',
      })
    }

    // Process children for body and backmatter nodes
    if (
      node.type.name === 'body' ||
      node.type.name === 'backmatter' ||
      node.type.name === 'abstracts'
    ) {
      const childOrderMap = new Map<string, number>()
      processChildNodes(
        node,
        false,
        distributedMap.get(key)!.children!,
        childOrderMap
      )
    }
  })

  // Final step: reorder the top-level map based on the comparison document
  const finalOrderedMap = new Map<string, NodeComparison>()

  // Sort keys based on their position in the comparison document
  const sortedKeys = [...distributedMap.keys()].sort((a, b) => {
    // Use the position from comparison document, or fallback to original if not in comparison
    const posA = comparisonOrderMap.get(a) ?? topLevelOrderMap.get(a) ?? 999
    const posB = comparisonOrderMap.get(b) ?? topLevelOrderMap.get(b) ?? 999
    return posA - posB
  })

  // Rebuild the map in sorted order
  for (const key of sortedKeys) {
    finalOrderedMap.set(key, distributedMap.get(key)!)
  }

  return finalOrderedMap
} 