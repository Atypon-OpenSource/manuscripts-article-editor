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
import diff_match_patch from 'diff-match-patch'
import { isEqual } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import { compareParagraphLike } from './compare-paragraph-like'
import {
  createComparisonDeleteAttrsDataTracked,
  createComparisonInsertAttrsDataTracked,
  createComparisonSetAttrsDataTracked,
} from './create-dataTracked-attrs'

interface NodeWithAttrs extends ManuscriptNode {
  attrs: Record<string, unknown>
}

/**
 * Compare two table elements and track changes between them.
 * This is the main entry point for table comparison.
 */
export const compareTableElement = (
  originalNode: ManuscriptNode,
  comparisonNode: ManuscriptNode
): ManuscriptNode => {
  if (!originalNode || !comparisonNode) {
    return comparisonNode
  }

  const newContent: ManuscriptNode[] = []

  comparisonNode.content.forEach((comparisonChild) => {
    let originalChild: ManuscriptNode | undefined = undefined

    originalNode.content.forEach((origChild) => {
      if (origChild.type.name === comparisonChild.type.name) {
        originalChild = origChild
      }
    })

    if (originalChild) {
      if (comparisonChild.type.name === 'table') {
        newContent.push(compareTable(originalChild, comparisonChild))
      } else if (comparisonChild.type.name === 'figcaption') {
        newContent.push(compareFigCaption(originalChild, comparisonChild))
      } else {
        const origWithAttrs = originalChild as NodeWithAttrs
        const compWithAttrs = comparisonChild as NodeWithAttrs

        if (!isEqual(origWithAttrs.attrs, compWithAttrs.attrs)) {
          const newAttrs = {
            ...compWithAttrs.attrs,
            dataTracked: [
              createComparisonSetAttrsDataTracked('', origWithAttrs.attrs),
            ],
          }
          newContent.push(
            comparisonChild.type.create(newAttrs, comparisonChild.content)
          )
        } else {
          newContent.push(comparisonChild)
        }
      }
    } else {
      newContent.push(markNodeAsInserted(comparisonChild))
    }
  })

  originalNode.content.forEach((originalChild) => {
    let found = false

    comparisonNode.content.forEach((comparisonChild) => {
      if (originalChild.type.name === comparisonChild.type.name) {
        found = true
      }
    })

    if (!found) {
      newContent.push(markNodeAsDeleted(originalChild))
    }
  })

  return schema.nodes.table_element.create(comparisonNode.attrs, newContent)
}

/**
 * Compare figcaption nodes and their content.
 */
export const compareFigCaption = (
  originalNode: ManuscriptNode,
  comparisonNode: ManuscriptNode
): ManuscriptNode => {
  const newContent: ManuscriptNode[] = []

  comparisonNode.content.forEach((comparisonChild) => {
    let originalChild: ManuscriptNode | undefined = undefined

    originalNode.content.forEach((origChild) => {
      if (origChild.type.name === comparisonChild.type.name) {
        originalChild = origChild
      }
    })

    if (originalChild) {
      if (comparisonChild.type.name === 'caption_title') {
        const hasOnlyText =
          containsOnlyTextNodes(originalChild) &&
          containsOnlyTextNodes(comparisonChild)
        if (hasOnlyText) {
          const result = compareParagraphLike(originalChild, comparisonChild)
          newContent.push(result)
        } else {
          newContent.push(
            schema.nodes.caption_title.create(
              comparisonChild.attrs,
              comparisonChild.content
            )
          )
        }
      } else if (comparisonChild.type.name === 'caption') {
        newContent.push(
          schema.nodes.caption.create(
            comparisonChild.attrs,
            comparisonChild.content
          )
        )
      } else {
        newContent.push(comparisonChild)
      }
    } else {
      newContent.push(markNodeAsInserted(comparisonChild))
    }
  })

  originalNode.content.forEach((originalChild) => {
    let found = false

    comparisonNode.content.forEach((comparisonChild) => {
      if (originalChild.type.name === comparisonChild.type.name) {
        found = true
      }
    })

    if (!found) {
      newContent.push(markNodeAsDeleted(originalChild))
    }
  })
  return schema.nodes.figcaption.create(comparisonNode.attrs, newContent)
}

const containsOnlyTextNodes = (node: ManuscriptNode): boolean => {
  if (!node.content || node.content.childCount === 0) {
    return true
  }

  for (let i = 0; i < node.content.childCount; i++) {
    const child = node.content.child(i)
    if (child.type.name !== 'text') {
      return false
    }
  }

  return true
}

/**
 * Compare table nodes and their rows.
 */
const compareTable = (
  originalNode: ManuscriptNode,
  comparisonNode: ManuscriptNode
): ManuscriptNode => {
  const newContent: ManuscriptNode[] = []

  const originalRows: ManuscriptNode[] = []
  const comparisonRows: ManuscriptNode[] = []
  const originalOther: ManuscriptNode[] = []
  const comparisonOther: ManuscriptNode[] = []

  originalNode.content.forEach((child) => {
    if (child.type.name === 'table_row') {
      originalRows.push(child)
    } else {
      originalOther.push(child)
    }
  })

  comparisonNode.content.forEach((child) => {
    if (child.type.name === 'table_row') {
      comparisonRows.push(child)
    } else {
      comparisonOther.push(child)
    }
  })

  const matches = findRowMatches(originalRows, comparisonRows)
  const matchedOrigIndices = new Set(matches.map((m) => m.origIndex))

  for (let compIndex = 0; compIndex < comparisonRows.length; compIndex++) {
    const match = matches.find((m) => m.compIndex === compIndex)

    if (match) {
      const originalRow = originalRows[match.origIndex]
      const comparisonRow = comparisonRows[compIndex]
      newContent.push(compareTableRow(originalRow, comparisonRow))
    } else {
      newContent.push(markRowAsInserted(comparisonRows[compIndex]))
    }
  }

  for (let origIndex = 0; origIndex < originalRows.length; origIndex++) {
    if (!matchedOrigIndices.has(origIndex)) {
      let insertPosition = 0

      const prevOrigIndex = origIndex - 1
      const nextOrigIndex = origIndex + 1

      if (prevOrigIndex >= 0 && matchedOrigIndices.has(prevOrigIndex)) {
        const prevMatch = matches.find((m) => m.origIndex === prevOrigIndex)
        if (prevMatch) {
          const prevCompIndex = prevMatch.compIndex
          insertPosition = newContent.findIndex(
            (node) =>
              node.attrs &&
              comparisonRows[prevCompIndex].attrs &&
              node.attrs.id === comparisonRows[prevCompIndex].attrs.id
          )
          if (insertPosition >= 0) {
            insertPosition += 1
          }
        }
      } else if (
        nextOrigIndex < originalRows.length &&
        matchedOrigIndices.has(nextOrigIndex)
      ) {
        const nextMatch = matches.find((m) => m.origIndex === nextOrigIndex)
        if (nextMatch) {
          const nextCompIndex = nextMatch.compIndex
          insertPosition = newContent.findIndex(
            (node) =>
              node.attrs &&
              comparisonRows[nextCompIndex].attrs &&
              node.attrs.id === comparisonRows[nextCompIndex].attrs.id
          )
        }
      }

      if (insertPosition < 0) {
        insertPosition = Math.min(origIndex, newContent.length)
      }

      newContent.splice(
        insertPosition,
        0,
        markRowAsDeleted(originalRows[origIndex])
      )
    }
  }

  comparisonOther.forEach((node) => {
    const originalOtherNode = originalOther.find(
      (n) => n.type.name === node.type.name
    )

    if (originalOtherNode) {
      const origWithAttrs = originalOtherNode as NodeWithAttrs
      const compWithAttrs = node as NodeWithAttrs

      if (!isEqual(origWithAttrs.attrs, compWithAttrs.attrs)) {
        const newAttrs = {
          ...compWithAttrs.attrs,
          dataTracked: [
            createComparisonSetAttrsDataTracked('', origWithAttrs.attrs),
          ],
        }
        newContent.push(node.type.create(newAttrs, node.content))
      } else {
        newContent.push(node)
      }
    } else {
      newContent.push(markNodeAsInserted(node))
    }
  })

  originalOther.forEach((node) => {
    const exists = comparisonOther.some((n) => n.type.name === node.type.name)
    if (!exists) {
      newContent.push(markNodeAsDeleted(node))
    }
  })

  return schema.nodes.table.create(comparisonNode.attrs, newContent)
}

/**
 * Find matches between original and comparison rows
 * Returns an array of {origIndex, compIndex} pairs
 */
interface RowMatch {
  origIndex: number
  compIndex: number
  similarity: number
}

const findRowMatches = (
  originalRows: ManuscriptNode[],
  comparisonRows: ManuscriptNode[]
): RowMatch[] => {
  const similarityThreshold = 0.7
  const matches: RowMatch[] = []

  const similarityMatrix: number[][] = []
  for (let i = 0; i < originalRows.length; i++) {
    similarityMatrix[i] = []
    for (let j = 0; j < comparisonRows.length; j++) {
      const similarity = calculateRowSimilarity(
        originalRows[i],
        comparisonRows[j]
      )
      similarityMatrix[i][j] =
        similarity >= similarityThreshold ? similarity : 0
    }
  }

  for (let i = 0; i < originalRows.length; i++) {
    const origRow = originalRows[i]
    if (!origRow.attrs?.id) {
      continue
    }

    for (let j = 0; j < comparisonRows.length; j++) {
      const compRow = comparisonRows[j]

      if (compRow.attrs?.id && origRow.attrs.id === compRow.attrs.id) {
        matches.push({ origIndex: i, compIndex: j, similarity: 1 })

        for (let x = 0; x < originalRows.length; x++) {
          similarityMatrix[x][j] = 0
        }
        for (let y = 0; y < comparisonRows.length; y++) {
          similarityMatrix[i][y] = 0
        }

        break
      }
    }
  }

  let remainingMatches = true
  while (remainingMatches) {
    remainingMatches = false
    let bestMatch = { origIndex: -1, compIndex: -1, similarity: 0 }

    for (let i = 0; i < originalRows.length; i++) {
      for (let j = 0; j < comparisonRows.length; j++) {
        if (similarityMatrix[i][j] > bestMatch.similarity) {
          bestMatch = {
            origIndex: i,
            compIndex: j,
            similarity: similarityMatrix[i][j],
          }
        }
      }
    }

    if (bestMatch.similarity > 0) {
      matches.push(bestMatch)
      remainingMatches = true

      for (let x = 0; x < originalRows.length; x++) {
        similarityMatrix[x][bestMatch.compIndex] = 0
      }
      for (let y = 0; y < comparisonRows.length; y++) {
        similarityMatrix[bestMatch.origIndex][y] = 0
      }
    }
  }

  matches.sort((a, b) => a.origIndex - b.origIndex)

  return matches
}

/**
 * Compare table row nodes and their cells.
 */
const compareTableRow = (
  originalRow: ManuscriptNode,
  comparisonRow: ManuscriptNode
): ManuscriptNode => {
  const newContent: ManuscriptNode[] = []

  const originalCells: ManuscriptNode[] = []
  const comparisonCells: ManuscriptNode[] = []

  if (originalRow.content) {
    originalRow.content.forEach((cell) => {
      originalCells.push(cell)
    })
  }

  if (comparisonRow.content) {
    comparisonRow.content.forEach((cell) => {
      comparisonCells.push(cell)
    })
  }

  const minCells = Math.min(originalCells.length, comparisonCells.length)
  for (let i = 0; i < minCells; i++) {
    newContent.push(compareTableCell(originalCells[i], comparisonCells[i]))
  }

  for (let i = minCells; i < comparisonCells.length; i++) {
    newContent.push(markCellAsInserted(comparisonCells[i]))
  }

  for (let i = minCells; i < originalCells.length; i++) {
    newContent.push(markCellAsDeleted(originalCells[i]))
  }

  const origRowAttrs = originalRow as NodeWithAttrs
  const compRowAttrs = comparisonRow as NodeWithAttrs
  const rowAttrs = { ...compRowAttrs.attrs }

  if (!isEqual(origRowAttrs.attrs, compRowAttrs.attrs)) {
    rowAttrs.dataTracked = [
      createComparisonSetAttrsDataTracked('', origRowAttrs.attrs),
    ]
  }

  return schema.nodes.table_row.create(rowAttrs, newContent)
}

/**
 * Compare table cell nodes and their content.
 */
const compareTableCell = (
  originalCell: ManuscriptNode,
  comparisonCell: ManuscriptNode
): ManuscriptNode => {
  const newContent: ManuscriptNode[] = []

  const originalTextBlocks: ManuscriptNode[] = []
  const comparisonTextBlocks: ManuscriptNode[] = []

  if (originalCell.content) {
    originalCell.content.forEach((block) => {
      originalTextBlocks.push(block)
    })
  }

  if (comparisonCell.content) {
    comparisonCell.content.forEach((block) => {
      comparisonTextBlocks.push(block)
    })
  }

  const minBlocks = Math.min(
    originalTextBlocks.length,
    comparisonTextBlocks.length
  )
  for (let i = 0; i < minBlocks; i++) {
    newContent.push(
      compareParagraphLike(originalTextBlocks[i], comparisonTextBlocks[i])
    )
  }

  for (let i = minBlocks; i < comparisonTextBlocks.length; i++) {
    newContent.push(markNodeAsInserted(comparisonTextBlocks[i]))
  }

  for (let i = minBlocks; i < originalTextBlocks.length; i++) {
    newContent.push(markNodeAsDeleted(originalTextBlocks[i]))
  }

  const origCellAttrs = originalCell as NodeWithAttrs
  const compCellAttrs = comparisonCell as NodeWithAttrs
  const cellAttrs = { ...compCellAttrs.attrs }

  if (!isEqual(origCellAttrs.attrs, compCellAttrs.attrs)) {
    cellAttrs.dataTracked = [
      createComparisonSetAttrsDataTracked('', origCellAttrs.attrs),
    ]
  }

  return comparisonCell.type.create(cellAttrs, newContent)
}

/**
 * Mark a node and its content as inserted.
 */
const markNodeAsInserted = (node: ManuscriptNode): ManuscriptNode => {
  if (node.isText) {
    return node.mark([
      schema.marks.tracked_insert.create({ dataTracked: { id: uuidv4() } }),
    ])
  }

  const newContent: ManuscriptNode[] = []

  if (node.content && node.content.childCount > 0) {
    node.content.forEach((child) => {
      newContent.push(markNodeAsInserted(child))
    })
  }

  const nodeWithAttrs = node as NodeWithAttrs
  const newAttrs = {
    ...nodeWithAttrs.attrs,
    dataTracked: [createComparisonInsertAttrsDataTracked('')],
  }

  return node.type.create(newAttrs, newContent, node.marks)
}

/**
 * Mark a node and its content as deleted.
 */
const markNodeAsDeleted = (node: ManuscriptNode): ManuscriptNode => {
  if (node.isText) {
    return node.mark([
      schema.marks.tracked_delete.create({ dataTracked: { id: uuidv4() } }),
    ])
  }

  const newContent: ManuscriptNode[] = []

  if (node.content && node.content.childCount > 0) {
    node.content.forEach((child) => {
      newContent.push(markNodeAsDeleted(child))
    })
  }

  const nodeWithAttrs = node as NodeWithAttrs
  const newAttrs = {
    ...nodeWithAttrs.attrs,
    dataTracked: [createComparisonDeleteAttrsDataTracked('')],
  }

  return node.type.create(newAttrs, newContent, node.marks)
}

/**
 * Mark a row as inserted, including all its cells
 */
const markRowAsInserted = (row: ManuscriptNode): ManuscriptNode => {
  const newContent: ManuscriptNode[] = []

  if (row.content) {
    row.content.forEach((cell) => {
      newContent.push(markCellAsInserted(cell))
    })
  }

  const rowWithAttrs = row as NodeWithAttrs
  const newAttrs = {
    ...rowWithAttrs.attrs,
    dataTracked: [createComparisonInsertAttrsDataTracked('')],
  }

  return schema.nodes.table_row.create(newAttrs, newContent)
}

/**
 * Mark a row as deleted, including all its cells
 */
const markRowAsDeleted = (row: ManuscriptNode): ManuscriptNode => {
  const newContent: ManuscriptNode[] = []

  if (row.content) {
    row.content.forEach((cell) => {
      newContent.push(markCellAsDeleted(cell))
    })
  }

  const rowWithAttrs = row as NodeWithAttrs
  const newAttrs = {
    ...rowWithAttrs.attrs,
    dataTracked: [createComparisonDeleteAttrsDataTracked('')],
  }

  return schema.nodes.table_row.create(newAttrs, newContent)
}

/**
 * Mark a cell as inserted, including all its content
 */
const markCellAsInserted = (cell: ManuscriptNode): ManuscriptNode => {
  const newContent: ManuscriptNode[] = []

  if (cell.content) {
    cell.content.forEach((block) => {
      newContent.push(markNodeAsInserted(block))
    })
  }

  const cellWithAttrs = cell as NodeWithAttrs
  const newAttrs = {
    ...cellWithAttrs.attrs,
    dataTracked: [createComparisonInsertAttrsDataTracked('')],
  }

  return cell.type.create(newAttrs, newContent)
}

/**
 * Mark a cell as deleted, including all its content
 */
const markCellAsDeleted = (cell: ManuscriptNode): ManuscriptNode => {
  const newContent: ManuscriptNode[] = []

  if (cell.content) {
    cell.content.forEach((block) => {
      newContent.push(markNodeAsDeleted(block))
    })
  }

  const cellWithAttrs = cell as NodeWithAttrs
  const newAttrs = {
    ...cellWithAttrs.attrs,
    dataTracked: [createComparisonDeleteAttrsDataTracked('')],
  }

  return cell.type.create(newAttrs, newContent)
}

/**
 * Calculate a similarity score between two rows
 * Returns a number between 0 (completely different) and 1 (identical)
 */
const calculateRowSimilarity = (
  row1: ManuscriptNode,
  row2: ManuscriptNode
): number => {
  if (row1.type.name !== row2.type.name) {
    return 0
  }

  const cellCount1 = row1.content ? row1.content.childCount : 0
  const cellCount2 = row2.content ? row2.content.childCount : 0

  if (cellCount1 === 0 && cellCount2 === 0) {
    return 1
  }
  if (cellCount1 === 0 || cellCount2 === 0) {
    return 0
  }

  if (
    Math.abs(cellCount1 - cellCount2) >
    Math.min(cellCount1, cellCount2) / 2
  ) {
    return 0.1
  }

  let matchingCells = 0
  const minCells = Math.min(cellCount1, cellCount2)

  for (let i = 0; i < minCells; i++) {
    const cell1 = row1.content.child(i)
    const cell2 = row2.content.child(i)

    const text1 = cell1.textContent || ''
    const text2 = cell2.textContent || ''

    const similarity = calculateTextSimilarity(text1, text2)

    if (similarity > 0.7) {
      matchingCells += similarity
    }
  }

  return matchingCells / minCells
}

/**
 * Calculate text similarity using Levenshtein distance
 */
const calculateTextSimilarity = (text1: string, text2: string): number => {
  if (text1 === text2) {
    return 1
  }
  if (!text1 || !text2) {
    return 0
  }

  const cleanText1 = cleanTextForComparison(text1)
  const cleanText2 = cleanTextForComparison(text2)

  if (cleanText1 === cleanText2) {
    return 0.95
  }

  const maxLen = Math.max(cleanText1.length, cleanText2.length)
  if (maxLen === 0) {
    return 1
  }

  const dmp = new diff_match_patch()
  const diffs = dmp.diff_main(cleanText1, cleanText2)
  dmp.diff_cleanupSemantic(diffs)

  let diffSize = 0
  for (const [op, text] of diffs) {
    if (op !== 0) {
      diffSize += text.length
    }
  }

  if (diffSize <= 3) {
    return 0.9
  }

  const distance = dmp.diff_levenshtein(diffs)
  return 1 - distance / maxLen
}

/**
 * Clean text for comparison by removing likely typos
 */
const cleanTextForComparison = (text: string): string => {
  const repeatedCharsRegex = /([a-z])\1{1,2}/gi
  let cleaned = text.replace(repeatedCharsRegex, '$1')

  cleaned = cleaned.replace(/\s+/g, ' ').trim()

  return cleaned
}
