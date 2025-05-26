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
import diff_match_patch from 'diff-match-patch'
import { isEqual } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import { compareTextLikeContent } from './compare-documents'
import {
  createDeleteAttrsDataTracked,
  createInsertAttrsDataTracked,
  createSetAttrsDataTracked,
} from './create-dataTracked-attrs'

export const compareParagraphLike = (
  originalNode: ManuscriptNode,
  comparisonNode: ManuscriptNode
): ManuscriptNode => {
  const originalHasOnlyText = containsOnlyTextNodes(originalNode)
  const comparisonHasOnlyText = containsOnlyTextNodes(comparisonNode)

  if (originalHasOnlyText && comparisonHasOnlyText) {
    return compareTextLikeContent(
      originalNode,
      comparisonNode,
      originalNode.type
    )
  }

  const originalChunks = flattenParagraph([...originalNode.content.content])
  const comparisonChunks = flattenParagraph([...comparisonNode.content.content])

  const originalString = stringifyChunks(originalChunks)
  const comparisonString = stringifyChunks(comparisonChunks)

  const dmp = new diff_match_patch()
  const diffs = dmp.diff_main(originalString, comparisonString)
  const content = rebuildFromDiff(diffs, originalChunks, comparisonChunks)
  return schema.nodes.paragraph.create(comparisonNode.attrs, content)
}

export const containsOnlyTextNodes = (node: ManuscriptNode): boolean => {
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

type FlattenedChunk = {
  type: 'text' | 'inline'
  key: string
  node: ManuscriptNode
}

const flattenParagraph = (nodes: ManuscriptNode[]): FlattenedChunk[] => {
  const chunks: FlattenedChunk[] = []
  let inlineCounter = 0

  for (const node of nodes) {
    if (node.type.name === 'text') {
      chunks.push({ type: 'text', key: node.text!, node })
    } else {
      let tag = ''
      if (
        node.type.name === 'cross_reference' &&
        node.attrs &&
        node.attrs.rids
      ) {
        tag = `[CROSS_REF:${node.attrs.rids.join(',')}]`
      } else {
        tag = `[INLINE_${inlineCounter++}]`
      }
      chunks.push({ type: 'inline', key: tag, node })
    }
  }

  return chunks
}

const stringifyChunks = (chunks: FlattenedChunk[]): string => {
  return chunks.map((c) => c.key).join('')
}

export const rebuildFromDiff = (
  diffs: [number, string][],
  originalChunks: FlattenedChunk[],
  comparisonChunks: FlattenedChunk[]
): ManuscriptNode[] => {
  const result: ManuscriptNode[] = []

  const originalChunkMap = buildChunkPositionMap(originalChunks)
  const comparisonChunkMap = buildChunkPositionMap(comparisonChunks)

  const originalInlineMap = new Map<string, ManuscriptNode>()
  const comparisonInlineMap = new Map<string, ManuscriptNode>()

  originalChunks.forEach((chunk) => {
    if (chunk.type === 'inline') {
      const node = chunk.node
      if (node.attrs && node.attrs.id) {
        originalInlineMap.set(node.attrs.id, node)
      }
      if (
        node.type.name === 'cross_reference' &&
        node.attrs &&
        node.attrs.rids
      ) {
        originalInlineMap.set(`cross_ref:${node.attrs.rids.join(',')}`, node)
      }
    }
  })

  comparisonChunks.forEach((chunk) => {
    if (chunk.type === 'inline') {
      const node = chunk.node
      if (node.attrs && node.attrs.id) {
        comparisonInlineMap.set(node.attrs.id, node)
      }
      if (
        node.type.name === 'cross_reference' &&
        node.attrs &&
        node.attrs.rids
      ) {
        comparisonInlineMap.set(`cross_ref:${node.attrs.rids.join(',')}`, node)
      }
    }
  })

  let origPos = 0
  let compPos = 0

  for (const [op, str] of diffs) {
    if (op === 0) {
      const startCompPos = compPos
      compPos += str.length
      origPos += str.length

      const chunks = getChunksInRange(
        comparisonChunks,
        comparisonChunkMap,
        startCompPos,
        compPos
      )

      for (const chunk of chunks) {
        if (chunk.type === 'text') {
          const chunkStartPos = getChunkStartPos(
            comparisonChunks,
            comparisonChunks.indexOf(chunk)
          )
          const chunkEndPos = chunkStartPos + chunk.key.length

          if (startCompPos > chunkStartPos || compPos < chunkEndPos) {
            const startOffset = Math.max(0, startCompPos - chunkStartPos)
            const endOffset = Math.min(
              chunk.key.length,
              compPos - chunkStartPos
            )
            const textContent = chunk.key.substring(startOffset, endOffset)

            const textNode = schema.text(textContent)
            result.push(textNode)
          } else {
            result.push(chunk.node)
          }
        } else {
          const inlineNode = chunk.node

          if (
            inlineNode.type.name === 'cross_reference' &&
            inlineNode.attrs &&
            inlineNode.attrs.rids
          ) {
            const key = `cross_ref:${inlineNode.attrs.rids.join(',')}`
            const originalNode = originalInlineMap.get(key)

            if (originalNode) {
              if (!isEqual(originalNode.attrs, inlineNode.attrs)) {
                const comparedNode = compareInlineNodeAttrs(
                  originalNode,
                  inlineNode,
                  'set'
                )
                result.push(comparedNode)
              } else {
                result.push(inlineNode)
              }
            }
          } else if (inlineNode.attrs && inlineNode.attrs.id) {
            const originalNode = originalInlineMap.get(inlineNode.attrs.id)
            if (originalNode) {
              if (!isEqual(originalNode.attrs, inlineNode.attrs)) {
                const comparedNode = compareInlineNodeAttrs(
                  originalNode,
                  inlineNode,
                  'set'
                )
                result.push(comparedNode)
              } else {
                result.push(inlineNode)
              }
            }
          } else {
            result.push(inlineNode)
          }
        }
      }
    } else if (op === 1) {
      const startCompPos = compPos
      compPos += str.length

      const chunks = getChunksInRange(
        comparisonChunks,
        comparisonChunkMap,
        startCompPos,
        compPos
      )

      for (const chunk of chunks) {
        if (chunk.type === 'text') {
          const chunkStartPos = getChunkStartPos(
            comparisonChunks,
            comparisonChunks.indexOf(chunk)
          )
          const chunkEndPos = chunkStartPos + chunk.key.length

          if (startCompPos > chunkStartPos || compPos < chunkEndPos) {
            const startOffset = Math.max(0, startCompPos - chunkStartPos)
            const endOffset = Math.min(
              chunk.key.length,
              compPos - chunkStartPos
            )
            const textContent = chunk.key.substring(startOffset, endOffset)

            const textNode = schema.text(textContent, [
              schema.marks.tracked_insert.create({
                dataTracked: { id: uuidv4() },
              }),
            ])
            result.push(textNode)
          } else {
            result.push(
              chunk.node.mark([
                schema.marks.tracked_insert.create({
                  dataTracked: { id: uuidv4() },
                }),
              ])
            )
          }
        } else {
          const inlineNode = chunk.node

          if (
            inlineNode.type.name === 'cross_reference' &&
            inlineNode.attrs &&
            inlineNode.attrs.rids
          ) {
            const key = `cross_ref:${inlineNode.attrs.rids.join(',')}`
            const originalNode = originalInlineMap.get(key)

            if (originalNode) {
              if (!isEqual(originalNode.attrs, inlineNode.attrs)) {
                const comparedNode = compareInlineNodeAttrs(
                  originalNode,
                  inlineNode,
                  'set'
                )
                result.push(comparedNode)
              } else {
                result.push(inlineNode)
              }
            } else {
              const trackedNode = compareInlineNodeAttrs(
                null,
                inlineNode,
                'insert'
              )
              result.push(trackedNode)
            }
          } else if (inlineNode.attrs && inlineNode.attrs.id) {
            const originalNode = originalInlineMap.get(inlineNode.attrs.id)
            if (originalNode) {
              if (!isEqual(originalNode.attrs, inlineNode.attrs)) {
                const comparedNode = compareInlineNodeAttrs(
                  originalNode,
                  inlineNode,
                  'set'
                )
                result.push(comparedNode)
              } else {
                result.push(inlineNode)
              }
            } else {
              const trackedNode = compareInlineNodeAttrs(
                null,
                inlineNode,
                'insert'
              )
              result.push(trackedNode)
            }
          } else {
            const trackedNode = compareInlineNodeAttrs(
              null,
              inlineNode,
              'insert'
            )
            result.push(trackedNode)
          }
        }
      }
    } else if (op === -1) {
      const startOrigPos = origPos
      origPos += str.length

      const chunks = getChunksInRange(
        originalChunks,
        originalChunkMap,
        startOrigPos,
        origPos
      )

      for (const chunk of chunks) {
        if (chunk.type === 'text') {
          const chunkStartPos = getChunkStartPos(
            originalChunks,
            originalChunks.indexOf(chunk)
          )
          const chunkEndPos = chunkStartPos + chunk.key.length

          if (startOrigPos > chunkStartPos || origPos < chunkEndPos) {
            const startOffset = Math.max(0, startOrigPos - chunkStartPos)
            const endOffset = Math.min(
              chunk.key.length,
              origPos - chunkStartPos
            )
            const textContent = chunk.key.substring(startOffset, endOffset)

            const textNode = schema.text(textContent, [
              schema.marks.tracked_delete.create({
                dataTracked: { id: uuidv4() },
              }),
            ])
            result.push(textNode)
          } else {
            result.push(
              chunk.node.mark([
                schema.marks.tracked_delete.create({
                  dataTracked: { id: uuidv4() },
                }),
              ])
            )
          }
        } else {
          const inlineNode = chunk.node

          if (
            inlineNode.type.name === 'cross_reference' &&
            inlineNode.attrs &&
            inlineNode.attrs.rids
          ) {
            const key = `cross_ref:${inlineNode.attrs.rids.join(',')}`
            const comparisonNode = comparisonInlineMap.get(key)

            if (!comparisonNode) {
              const trackedNode = compareInlineNodeAttrs(
                inlineNode,
                inlineNode,
                'delete'
              )
              result.push(trackedNode)
            }
          } else if (inlineNode.attrs && inlineNode.attrs.id) {
            const comparisonNode = comparisonInlineMap.get(inlineNode.attrs.id)
            if (!comparisonNode) {
              const trackedNode = compareInlineNodeAttrs(
                inlineNode,
                inlineNode,
                'delete'
              )
              result.push(trackedNode)
            }
          } else {
            const trackedNode = compareInlineNodeAttrs(
              inlineNode,
              inlineNode,
              'delete'
            )
            result.push(trackedNode)
          }
        }
      }
    }
  }

  return result
}

const getChunkStartPos = (chunks: FlattenedChunk[], index: number): number => {
  let pos = 0
  for (let i = 0; i < index; i++) {
    pos += chunks[i].key.length
  }
  return pos
}

const getChunksInRange = (
  chunks: FlattenedChunk[],
  posMap: { startPos: number; endPos: number }[],
  startPos: number,
  endPos: number
): FlattenedChunk[] => {
  const result: FlattenedChunk[] = []

  for (let i = 0; i < chunks.length; i++) {
    const { startPos: chunkStart, endPos: chunkEnd } = posMap[i]

    if (chunkEnd > startPos && chunkStart < endPos) {
      result.push(chunks[i])
    }
  }

  return result
}

const buildChunkPositionMap = (
  chunks: FlattenedChunk[]
): { startPos: number; endPos: number }[] => {
  const posMap: { startPos: number; endPos: number }[] = []
  let currentPos = 0

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const chunkLength = chunk.key.length

    posMap.push({
      startPos: currentPos,
      endPos: currentPos + chunkLength,
    })

    currentPos += chunkLength
  }

  return posMap
}

const compareInlineNodeAttrs = (
  originalNode: ManuscriptNode | null,
  comparisonNode: ManuscriptNode,
  operation: 'set' | 'insert' | 'delete' = 'set'
): ManuscriptNode => {
  if (operation === 'insert' || !originalNode) {
    return comparisonNode.type.create(
      {
        ...comparisonNode.attrs,
        dataTracked: [createInsertAttrsDataTracked('', comparisonNode.attrs)],
      },
      comparisonNode.content,
      comparisonNode.marks
    )
  } else if (operation === 'delete') {
    return originalNode.type.create(
      {
        ...originalNode.attrs,
        dataTracked: [createDeleteAttrsDataTracked('', originalNode.attrs)],
      },
      originalNode.content,
      originalNode.marks
    )
  } else if (!isEqual(originalNode.attrs, comparisonNode.attrs)) {
    return comparisonNode.type.create(
      {
        ...comparisonNode.attrs,
        dataTracked: [createSetAttrsDataTracked('', originalNode.attrs)],
      },
      comparisonNode.content,
      comparisonNode.marks
    )
  } else {
    return comparisonNode
  }
}
