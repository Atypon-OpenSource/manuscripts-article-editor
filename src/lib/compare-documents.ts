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

import { ManuscriptNode, schema } from '@manuscripts/transform'
import { NodeType } from 'prosemirror-model'
import { findChildrenByType } from 'prosemirror-utils'

// Import comparison utilities from local files
import {
  createDeleteAttrsDataTracked,
  createInsertAttrsDataTracked,
  createSetAttrsDataTracked,
} from './create-dataTracked-attrs'
import { distributeNodesForComparison, NodeComparison } from './distribute-nodes'
import { diff_match_patch } from 'diff-match-patch'
import { v4 as uuidv4 } from 'uuid'
import { isEqual } from 'lodash'
import { compareParagraphLike } from './compare-paragraph-like'
import { compareTableElement } from './compare-table-element'
import { compareFigureElement } from './compare-figure-element'
// Define ManuscriptSnapshot type locally since we can't import from body-editor components
export interface ManuscriptSnapshot {
  id: string
  snapshot: any
  name: string
  createdAt: string
}

export const compareDocuments = (
  originalSnapshot: ManuscriptSnapshot,
  comparisonSnapshot: ManuscriptSnapshot
) => {
  const originalDocument = schema.nodeFromJSON(originalSnapshot.snapshot)
  const comparisonDocument = schema.nodeFromJSON(comparisonSnapshot.snapshot)

  const originalTopLevelNodes = extractTopLevelNodes(originalDocument)
  const comparisonTopLevelNodes = extractTopLevelNodes(comparisonDocument)
  const distributedNodes = distributeNodesForComparison(
    originalTopLevelNodes,
    comparisonTopLevelNodes
  )
  const comparedNodes: ManuscriptNode[] = []

  for (const [
    ,
    { originalNode, comparisonNode, children, status },
  ] of distributedNodes.entries()) {
    if (status === 'deleted') {
      const finalAttrs = {
        ...originalNode!.attrs,
        dataTracked: [createDeleteAttrsDataTracked('', originalNode!.attrs)],
      }
      comparedNodes.push(
        originalNode!.type.create(finalAttrs, originalNode!.content)
      )
    } else if (
      status === 'inserted' &&
      comparisonNode?.type !== schema.nodes.keywords
    ) {
      const finalAttrs = {
        ...comparisonNode!.attrs,
        dataTracked: [createInsertAttrsDataTracked('', comparisonNode!.attrs)],
      }
      comparedNodes.push(
        comparisonNode!.type.create(finalAttrs, comparisonNode!.content)
      )
    } else if (
      originalNode?.type === schema.nodes.title ||
      comparisonNode?.type === schema.nodes.title
    ) {
      const comparedTitle = compareTitles(originalNode!, comparisonNode!)
      comparedNodes.push(comparedTitle)
    } else if (
      originalNode?.type === schema.nodes.contributors ||
      comparisonNode?.type === schema.nodes.author
    ) {
      const comparedAuthor = compareNodeAttrs(
        comparisonNode!.attrs,
        originalNode!,
        comparisonNode!,
        schema.nodes.contributor,
        schema.nodes.contributors
      )
      comparedNodes.push(comparedAuthor)
    } else if (
      originalNode?.type === schema.nodes.affiliations ||
      comparisonNode?.type === schema.nodes.affiliations
    ) {
      const comparedAffiliations = compareNodeAttrs(
        comparisonNode!.attrs,
        originalNode!,
        comparisonNode!,
        schema.nodes.affiliation,
        schema.nodes.affiliations
      )
      comparedNodes.push(comparedAffiliations)
    } else if (
      originalNode?.type === schema.nodes.keywords ||
      comparisonNode?.type === schema.nodes.keywords
    ) {
      comparedNodes.push(
        compareKeywords(originalNode!, comparisonNode!, status)
      )
    } else if (
      originalNode?.type === schema.nodes.abstracts ||
      comparisonNode?.type === schema.nodes.abstracts
    ) {
      const comparedAbstracts = compareSectionNodes(
        comparisonNode!.attrs,
        children!,
        schema.nodes.abstracts
      )
      comparedNodes.push(comparedAbstracts)
    } else if (
      originalNode?.type === schema.nodes.body ||
      comparisonNode?.type === schema.nodes.body
    ) {
      const comparedBody = compareSectionNodes(
        comparisonNode!.attrs,
        children!,
        schema.nodes.body
      )
      comparedNodes.push(comparedBody)
    } else if (
      originalNode?.type === schema.nodes.backmatter ||
      comparisonNode?.type === schema.nodes.backmatter
    ) {
      const comparedBackmatter = compareSectionNodes(
        comparisonNode!.attrs,
        children!,
        schema.nodes.backmatter
      )
      comparedNodes.push(comparedBackmatter)
    } else {
      comparedNodes.push(comparisonNode || originalNode!)
    }
  }
  const manuscript = schema.nodes.manuscript.create(
    comparisonDocument.attrs,
    comparedNodes
  )

  return manuscript
}

const extractTopLevelNodes = (document: ManuscriptNode) => {
  const topLevelNodes: ManuscriptNode[] = []
  document.content.forEach((node) => {
    topLevelNodes.push(node)
  })
  return topLevelNodes
}

const compareTitles = (
  originalTitle: ManuscriptNode,
  comparisonTitle: ManuscriptNode
) => compareTextLikeContent(originalTitle, comparisonTitle, schema.nodes.title)

const compareKeywords = (
  originalKeywords: ManuscriptNode,
  comparisonKeywords: ManuscriptNode,
  status?: string
) => {
  const comparisonKeywordsGroup = findChildrenByType(
    comparisonKeywords,
    schema.nodes.keyword_group
  )[0].node
  const comparisonKeywordsElement = comparisonKeywordsGroup.content.content.map(
    (keyword) => keyword
  )
  const sectionTitle = findChildrenByType(
    comparisonKeywords,
    schema.nodes.section_title
  )[0].node
  const keywordsElementNode = findChildrenByType(
    comparisonKeywords,
    schema.nodes.keywords_element
  )[0].node

  if (status === 'inserted') {
    const KeywordsAttrs = {
      ...comparisonKeywords.attrs,
      dataTracked: [createInsertAttrsDataTracked('', comparisonKeywords.attrs)],
    }
    const keywordsElementAttrs = {
      ...keywordsElementNode.attrs,
      dataTracked: [
        createInsertAttrsDataTracked('', keywordsElementNode.attrs),
      ],
    }
    const keywordsGroupAttrs = {
      ...comparisonKeywordsGroup.attrs,
      dataTracked: [
        createInsertAttrsDataTracked('', comparisonKeywordsGroup.attrs),
      ],
    }
    const sectionTitleAttrs = {
      ...sectionTitle.attrs,
      dataTracked: [createInsertAttrsDataTracked('', sectionTitle.attrs)],
    }

    return schema.nodes.keywords.create(KeywordsAttrs, [
      schema.nodes.section_title.create(
        sectionTitleAttrs,
        sectionTitle.content
      ),
      schema.nodes.keywords_element.create(
        keywordsElementAttrs,
        schema.nodes.keyword_group.create(
          keywordsGroupAttrs,
          comparisonKeywordsGroup.content
        )
      ),
    ])
  }
  const keywordsElementGroup = findChildrenByType(
    originalKeywords,
    schema.nodes.keyword_group
  )[0].node
  const keywordsElement = keywordsElementGroup.content.content.map(
    (keyword) => keyword
  )
  const diffs: ManuscriptNode[] = compareNodeById(
    keywordsElement,
    comparisonKeywordsElement,
    schema.nodes.keyword
  )
  return schema.nodes.keywords.create(originalKeywords.attrs, [
    sectionTitle,
    schema.nodes.keywords_element.create(
      keywordsElementNode.attrs,
      schema.nodes.keyword_group.create(keywordsElementGroup.attrs, diffs)
    ),
  ])
}

const compareSectionNodes = (
  comparisonNodeAttrs: Record<string, unknown>,
  childrenMap: Map<string, NodeComparison>,
  sectionNodeType: NodeType
) => {
  const childNodes: ManuscriptNode[] = []
  for (const [key] of childrenMap.entries()) {
    const rebuilt = rebuildProseMirrorNodeTree(key, childrenMap)
    childNodes.push(rebuilt)
  }
  return sectionNodeType.create(comparisonNodeAttrs, childNodes)
}

export const compareTextLikeContent = (
  original: ManuscriptNode,
  comparison: ManuscriptNode,
  wrapperNodeType: NodeType
): ManuscriptNode => {
    const dmp = new diff_match_patch()
    const diffs = dmp.diff_main(original.textContent, comparison.textContent)
    dmp.diff_cleanupSemantic(diffs)
    console.log('diffs', diffs)
    const content = diffs.map(([op, text]) => {
      if (op === -1) {
        return schema.text(text, [
          schema.marks.tracked_delete.create({ dataTracked: { id: uuidv4() } }),
        ])
      } else if (op === 1) {
        return schema.text(text, [
          schema.marks.tracked_insert.create({ dataTracked: { id: uuidv4() } }),
        ])
      } else {
        return schema.text(text)
      }
    })
    return wrapperNodeType.create(comparison.attrs, content)
}

export const compareNodeAttrs = (
    wrapperAttrs: Record<string, unknown>,
    originalNode: ManuscriptNode,
    comparisonNode: ManuscriptNode,
    itemNodeType: NodeType,
    wrapperNodeType: NodeType
  ): ManuscriptNode => {
    const diffs: ManuscriptNode[] = []
  
    const originalMap = new Map<string, ManuscriptNode>()
    const comparisonMap = new Map<string, ManuscriptNode>()
    originalNode.content.content.forEach((item) => {
      originalMap.set(item.attrs.id, item)
    })
  
    comparisonNode.content.content.forEach((item) => {
      comparisonMap.set(item.attrs.id, item)
    })
    // Handle deleted or modified
    originalMap.forEach((originalItem, id) => {
      const comparisonItem = comparisonMap.get(id)
  
      if (!comparisonItem) {
        diffs.push(
          itemNodeType.create(
            {
              ...originalItem.attrs,
              dataTracked: [createDeleteAttrsDataTracked(id, originalItem.attrs)],
            },
            originalItem.content
          )
        )
      } else if (!isEqual(originalItem.attrs, comparisonItem.attrs)) {
        diffs.push(
          itemNodeType.create(
            {
              ...comparisonItem.attrs,
              dataTracked: [createSetAttrsDataTracked(id, originalItem.attrs)],
            },
            originalItem.content
          )
        )
      } else {
        diffs.push(comparisonItem)
      }
    })
  
    // Handle additions
    comparisonMap.forEach((comparisonItem, id) => {
      if (!originalMap.has(id)) {
        diffs.push(
          itemNodeType.create(
            {
              ...comparisonItem.attrs,
              dataTracked: [
                createInsertAttrsDataTracked(id, comparisonItem.attrs),
              ],
            },
            comparisonItem.content
          )
        )
      }
    })
  
    return wrapperNodeType.create(wrapperAttrs, diffs)
  }

export const compareNodeById = (
    originalNode: ManuscriptNode[],
    comparisonNode: ManuscriptNode[],
    itemNodeType: NodeType
  ): ManuscriptNode[] => {
    const diffs: ManuscriptNode[] = []
  
    const originalMap = new Map<string, ManuscriptNode>()
    const comparisonMap = new Map<string, ManuscriptNode>()
    originalNode.forEach((item) => {
      originalMap.set(item.attrs.id, item)
    })
  
    comparisonNode.forEach((item) => {
      comparisonMap.set(item.attrs.id, item)
    })
    // Handle deleted or modified
    originalMap.forEach((originalItem) => {
      const comparisonItem = comparisonMap.get(originalItem.attrs.id)
  
      if (!comparisonItem) {
        diffs.push(
          itemNodeType.create(
            {
              ...originalItem.attrs,
              dataTracked: [
                createDeleteAttrsDataTracked(
                  originalItem.attrs.id,
                  originalItem.attrs
                ),
              ],
            },
            originalItem.content
          )
        )
      } else {
        diffs.push(comparisonItem)
      }
    })
  
    // Handle additions
    comparisonMap.forEach((comparisonItem) => {
      if (!originalMap.has(comparisonItem.attrs.id)) {
        diffs.push(
          itemNodeType.create(
            {
              ...comparisonItem.attrs,
              dataTracked: [
                createInsertAttrsDataTracked(
                  comparisonItem.attrs.id,
                  comparisonItem.attrs
                ),
              ],
            },
            comparisonItem.content
          )
        )
      }
    })
  
    return diffs
  }

  export const rebuildProseMirrorNodeTree = (
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
  
    if (entry.children) {
      for (const childId of entry.children.keys()) {
        const childNode = rebuildProseMirrorNodeTree(childId, entry.children)
        rebuiltChildren.push(childNode)
      }
    }
  
    if (entry.status === 'deleted') {
      const finalAttrs = {
        ...baseNode.attrs,
        dataTracked: [createDeleteAttrsDataTracked('', baseNode.attrs)],
      }
      return baseNode.type.create(
        finalAttrs,
        rebuiltChildren.length > 0 ? rebuiltChildren : baseNode.content
      )
    } else if (entry.status === 'inserted') {
      const finalAttrs = {
        ...baseNode.attrs,
        dataTracked: [createInsertAttrsDataTracked('', baseNode.attrs)],
      }
      return baseNode.type.create(
        finalAttrs,
        rebuiltChildren.length > 0 ? rebuiltChildren : baseNode.content
      )
    } else if (
      entry.originalNode?.type.name === 'paragraph' &&
      entry.comparisonNode?.type.name === 'paragraph'
    ) {
      const comparedText = compareParagraphLike(
        entry.originalNode,
        entry.comparisonNode
      )
      return comparedText
    } else if (
      entry.originalNode?.type === schema.nodes.section_title &&
      entry.comparisonNode?.type === schema.nodes.section_title
    ) {
      const comparedText = compareTextLikeContent(
        entry.originalNode,
        entry.comparisonNode,
        schema.nodes.section_title
      )
      return comparedText
    } else if (
      entry.originalNode?.type.name === 'table_element' &&
      entry.comparisonNode?.type.name === 'table_element'
    ) {
      const comparedTable = compareTableElement(
        entry.originalNode,
        entry.comparisonNode
      )
      return comparedTable
    } else if (
      entry.originalNode?.type === schema.nodes.figure_element ||
      entry.comparisonNode?.type === schema.nodes.figure_element
    ) {
      if (entry.children) {
        const figureElementChildren = compareFigureElement(entry.children)
        return schema.nodes.figure_element.create(
          entry.comparisonNode?.attrs,
          figureElementChildren
        )
      }
    } else if (
      entry.originalNode?.type === schema.nodes.bibliography_element ||
      entry.comparisonNode?.type === schema.nodes.bibliography_element
    ) {
      const comparedBibliography = compareNodeAttrs(
        entry.comparisonNode!.attrs,
        entry.originalNode!,
        entry.comparisonNode!,
        schema.nodes.bibliography_item,
        schema.nodes.bibliography_element
      )
      return comparedBibliography
    } else if (
      entry.originalNode?.type === schema.nodes.equation_element ||
      entry.comparisonNode?.type === schema.nodes.equation_element
    ) {
      const comparedEquation = compareNodeAttrs(
        entry.comparisonNode!.attrs,
        entry.originalNode!,
        entry.comparisonNode!,
        schema.nodes.equation,
        schema.nodes.equation_element
      )
      return comparedEquation
    }
  
    const finalAttrs = { ...baseNode.attrs }
  
    return baseNode.type.create(
      finalAttrs,
      rebuiltChildren.length > 0 ? rebuiltChildren : baseNode.content
    )
  }


export const compareSingleNodeAttrs = (
    originalNode: ManuscriptNode,
    comparisonNode: ManuscriptNode,
    nodeType: NodeType
  ): ManuscriptNode => {
    const originalAttrs = originalNode?.attrs || {}
    const comparisonAttrs = comparisonNode?.attrs || {}
  
    if (!isEqual(originalAttrs, comparisonAttrs)) {
      return nodeType.create(
        {
          ...comparisonAttrs,
          dataTracked: [createSetAttrsDataTracked('', originalAttrs)],
        },
        comparisonNode?.content || null
      )
    } else {
      return nodeType.create(comparisonAttrs, comparisonNode?.content || null)
    }
  }